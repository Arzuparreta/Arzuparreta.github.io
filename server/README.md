# Publisher del Observatorio

Hace que **now playing** y **system** sean datos reales. Un timer ligero en
`desktop-ruben` lee Soundsible (en local) + el sistema y hace UPSERT de dos filas
en una tabla pública de tu Supabase. La web las lee por el mismo REST público que
ya usa para transparencia. Soundsible no se expone; la service key se queda aquí.

```
Soundsible :5005 ─┐
/proc, ss        ─┤→ publish.sh ──(service key)──► Supabase observatorio_state
systemctl/ss     ─┘                                        │ (anon, solo-lectura)
                                                           ▼
                            web (github.io) ◄── REST público + CORS
```

## 1. Crear la tabla (una vez)

```bash
DB=$(grep -E '^DATABASE_URL=' ../../espana-transparente/etl/.env | cut -d= -f2- | tr -d '"')
psql "$DB" -f observatorio_state.sql
```

Tabla aislada, additiva, solo-lectura pública. Tu app de transparencia no la toca.
Reversible: `drop table public.observatorio_state;`.

## 2. Instalar el publisher + timer de usuario (sin sudo)

```bash
SERVICE_KEY=$(grep -E '^SUPABASE_SERVICE_ROLE_KEY=' ../../espana-transparente/etl/.env | cut -d= -f2- | tr -d '"')
mkdir -p ~/.config/observatorio ~/.config/systemd/user ~/.local/bin
umask 077; printf 'OBS_SERVICE_KEY=%s\n' "$SERVICE_KEY" > ~/.config/observatorio/env
install -m 755 publish.sh ~/.local/bin/observatorio-publish.sh
cp observatorio.service observatorio.timer ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now observatorio.timer
systemctl --user list-timers observatorio.timer
```

Requiere `jq` y `curl`. El timer corre cada 10s.

> **24/7:** el timer de usuario corre mientras la sesión esté activa. Para que siga
> con la sesión cerrada: `sudo loginctl enable-linger $USER` (único paso con sudo).

## 3. La web ya lo consume

`js/feeds.js` lee `observatorio_state` del mismo `CONFIG.supabaseUrl`. Nada que tocar.
Cuando el publisher actualiza (cada 10s), los paneles muestran `● live`; si lleva
>90s sin actualizar, muestran honestamente "sin conexión".

## Variables de entorno (`~/.config/observatorio/env` o el shell)

| Var | Defecto | Para qué |
|---|---|---|
| `OBS_SERVICE_KEY` | (obligatoria) | service_role key de Supabase (escribe la tabla) |
| `OBS_SUPABASE_REST` | `http://127.0.0.1:54321/rest/v1` | REST local de Supabase |
| `SOUNDSIBLE_URL` | `http://127.0.0.1:5005` | Soundsible local |
| `OBS_SERVICES` | `soundsible:5005 supabase:54321 postgres:54322 tailscale` | servicios a vigilar (por puerto) |
