#!/usr/bin/env bash
# =============================================================================
# observatorio-publish — lee Soundsible (local) + stats del sistema y hace
# UPSERT de dos filas en la tabla pública `observatorio_state` de tu Supabase.
#
# La web lee esa tabla por el REST público (anon, solo-lectura). La service key
# se queda AQUÍ (env OBS_SERVICE_KEY), nunca toca el repo ni el navegador.
# Soundsible no se expone: solo sale título/artista/álbum/posición.
#
# Requiere: bash, curl, jq.
# Config por entorno:
#   OBS_SERVICE_KEY   (obligatoria)  service_role key de Supabase
#   OBS_SUPABASE_REST (opcional)     por defecto http://127.0.0.1:54321/rest/v1
#   SOUNDSIBLE_URL    (opcional)     por defecto http://127.0.0.1:5005
#   OBS_SERVICES      (opcional)     "nombre:puerto" a vigilar (o "tailscale")
# =============================================================================
set -euo pipefail

REST="${OBS_SUPABASE_REST:-http://127.0.0.1:54321/rest/v1}"
KEY="${OBS_SERVICE_KEY:?falta OBS_SERVICE_KEY}"
SOUNDSIBLE_URL="${SOUNDSIBLE_URL:-http://127.0.0.1:5005}"
# se comprueba si el puerto está en escucha (real), no el unit de systemd.
# "tailscale" es especial (se comprueba con `tailscale status`).
SERVICES=(${OBS_SERVICES:-soundsible:5005 supabase:54321 postgres:54322 tailscale})

# Storage para la carátula (Supabase Storage, bucket público)
STORAGE="${OBS_STORAGE:-${REST%/rest/v1}/storage/v1}"
PUBLIC_BASE="${OBS_PUBLIC_BASE:-https://desktop-ruben.taileed0d5.ts.net}"
BUCKET="${OBS_BUCKET:-observatorio}"
STATE_DIR="${OBS_STATE_DIR:-${TMPDIR:-/tmp}/observatorio}"; mkdir -p "$STATE_DIR"

# --- now playing + carátula (sanitizado; 204/empty = nada sonando) ----------
state="$(curl -fsS -m 2 "$SOUNDSIBLE_URL/api/playback/state" 2>/dev/null || true)"
cover_url=""
if [ -n "$state" ] && echo "$state" | jq -e '(.is_playing == true) and ((.track.title // null) != null)' >/dev/null 2>&1; then
  tid="$(echo "$state" | jq -r '.track_id // .track.id // empty')"
  if [ -n "$tid" ]; then
    key="cover/$(printf '%s' "$tid" | tr -c 'A-Za-z0-9._-' '_')"
    # solo sube la carátula cuando cambia la pista (dedupe)
    if [ "$tid" != "$(cat "$STATE_DIR/last_cover_id" 2>/dev/null || true)" ]; then
      if curl -fsS -m 5 "$SOUNDSIBLE_URL/api/static/cover/$tid" -o "$STATE_DIR/cover.img" 2>/dev/null; then
        ct="$(file --mime-type -b "$STATE_DIR/cover.img" 2>/dev/null || echo image/jpeg)"
        if curl -fsS -m 10 -X PUT "$STORAGE/object/$BUCKET/$key" \
             -H "Authorization: Bearer $KEY" -H "apikey: $KEY" \
             -H "x-upsert: true" -H "Content-Type: $ct" \
             --data-binary @"$STATE_DIR/cover.img" >/dev/null; then
          printf '%s' "$tid" > "$STATE_DIR/last_cover_id"
        fi
      fi
    fi
    cover_url="$PUBLIC_BASE/storage/v1/object/public/$BUCKET/$key"
  fi
  np="$(echo "$state" | jq -c --arg cover "$cover_url" '{
    title:        (.track.title    // null),
    artist:       (.track.artist   // null),
    album:        (.track.album    // null),
    position_sec: (.position_sec   // 0),
    duration_sec: (.track.duration // 0),
    is_playing:   true,
    cover_url:    (if $cover == "" then null else $cover end)
  }')"
else
  np='{"is_playing":false}'
fi

# --- system -----------------------------------------------------------------
read -r load1 _ < /proc/loadavg
uptime_sec="$(cut -d. -f1 /proc/uptime)"
mem_total="$(awk '/MemTotal/{print $2}' /proc/meminfo)"
mem_avail="$(awk '/MemAvailable/{print $2}' /proc/meminfo)"
mem_pct=$(( (mem_total - mem_avail) * 100 / mem_total ))
# puertos en escucha ahora mismo (real)
listening="$(ss -ltnH 2>/dev/null | awk '{print $4}' | grep -oE '[0-9]+$' | sort -u)"
services_json="$(for s in "${SERVICES[@]}"; do
  name="${s%%:*}"; port="${s#*:}"
  if [ "$name" = "tailscale" ]; then
    tailscale status >/dev/null 2>&1 && up=true || up=false
  elif [ "$port" != "$s" ] && printf '%s\n' "$listening" | grep -qx "$port"; then
    up=true
  else
    up=false
  fi
  printf '{"name":"%s","up":%s}\n' "$name" "$up"
done | jq -s -c '.')"
sys="$(jq -nc --argjson u "$uptime_sec" --arg l "$load1" --argjson m "$mem_pct" --argjson svc "$services_json" \
  '{uptime_sec:$u, load:($l|tonumber), mem_pct:$m, services:$svc}')"

# --- upsert (merge-duplicates sobre la PK `key`) ----------------------------
payload="$(jq -nc --argjson np "$np" --argjson sys "$sys" \
  '[{key:"nowplaying",value:$np,updated_at:(now|todate)},
    {key:"system",    value:$sys,updated_at:(now|todate)}]')"

curl -fsS -m 10 -X POST "$REST/observatorio_state" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d "$payload" >/dev/null
