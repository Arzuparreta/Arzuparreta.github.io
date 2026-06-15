#!/usr/bin/env bash
# =============================================================================
# observatorio-publish — lee Soundsible (local) + stats del sistema y escribe
# dos JSON pequeños y SANITIZADOS en una ruta estática pública.
#
# Soundsible se queda cerrado a LAN/Tailscale; aquí solo sale lo que tú decides
# (título/artista/álbum) y un puñado de métricas. Coste: unos ms cada 30s.
#
# Requiere: bash, curl, jq.  Sirve OUT_DIR por nginx/caddy con CORS (ver README).
# =============================================================================
set -euo pipefail

OUT_DIR="${OBS_OUT_DIR:-/var/www/observatorio}"
SOUNDSIBLE_URL="${SOUNDSIBLE_URL:-http://127.0.0.1:5005}"
SOUNDSIBLE_TOKEN="${SOUNDSIBLE_TOKEN:-}"           # opcional si confías en LAN
SERVICES=(${OBS_SERVICES:-postgres nginx soundsible tailscaled})

mkdir -p "$OUT_DIR"

# --- now playing (solo campos públicos) -------------------------------------
auth=()
[ -n "$SOUNDSIBLE_TOKEN" ] && auth=(-H "Authorization: Bearer $SOUNDSIBLE_TOKEN")
state="$(curl -fsS --max-time 2 "${auth[@]}" "$SOUNDSIBLE_URL/api/playback/state" 2>/dev/null || echo '{}')"

echo "$state" | jq -c '{
  title:        (.track.title    // null),
  artist:       (.track.artist   // null),
  album:        (.track.album    // null),
  position_sec: (.position_sec   // 0),
  duration_sec: (.track.duration // 0),
  is_playing:   (.is_playing     // false),
  updated_at:   now
}' > "$OUT_DIR/nowplaying.json.tmp" && mv "$OUT_DIR/nowplaying.json.tmp" "$OUT_DIR/nowplaying.json"

# --- stats del sistema ------------------------------------------------------
read -r load1 _ < /proc/loadavg
uptime_sec="$(cut -d. -f1 /proc/uptime)"
mem_total="$(awk '/MemTotal/{print $2}' /proc/meminfo)"
mem_avail="$(awk '/MemAvailable/{print $2}' /proc/meminfo)"
mem_pct=$(( (mem_total - mem_avail) * 100 / mem_total ))

services_json="["
first=1
for s in "${SERVICES[@]}"; do
  if systemctl is-active "$s" >/dev/null 2>&1; then up=true; else up=false; fi
  [ $first -eq 0 ] && services_json+=","
  services_json+="{\"name\":\"$s\",\"up\":$up}"
  first=0
done
services_json+="]"

printf '{"uptime_sec":%s,"load":%s,"mem_pct":%s,"services":%s}\n' \
  "$uptime_sec" "$load1" "$mem_pct" "$services_json" \
  > "$OUT_DIR/stats.json.tmp" && mv "$OUT_DIR/stats.json.tmp" "$OUT_DIR/stats.json"
