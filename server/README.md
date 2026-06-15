# Publisher del Observatorio (opcional)

Activa los paneles **now playing** y **system** con datos reales. Mientras no
exista, la web los simula de forma creíble — no rompe nada.

La idea: un timer ligero lee Soundsible **en local** y el sistema, y escribe dos
JSON pequeños y **sanitizados** en una ruta estática pública. Soundsible nunca se
expone a internet; solo sale lo que decides aquí.

## 1. Instalar el script

```bash
sudo install -m 755 publish.sh /usr/local/bin/observatorio-publish.sh
sudo apt install -y jq        # o el gestor que toque
sudo mkdir -p /var/www/observatorio
```

Prueba a mano:

```bash
OBS_OUT_DIR=/var/www/observatorio /usr/local/bin/observatorio-publish.sh
cat /var/www/observatorio/nowplaying.json
cat /var/www/observatorio/stats.json
```

## 2. Programarlo (systemd)

```bash
sudo cp observatorio.service observatorio.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now observatorio.timer
systemctl list-timers observatorio.timer
```

## 3. Servirlo con CORS (nginx)

```nginx
location /observatorio/ {
    alias /var/www/observatorio/;
    add_header Access-Control-Allow-Origin "*" always;   # o tu dominio exacto
    add_header Cache-Control "no-store" always;
    default_type application/json;
}
```

> Sirve esto desde un host **público** que ya tengas (el VPS de transparencia, o
> el Tailscale **Funnel** — que sí es público, a diferencia de Tailscale serve).

## 4. Apuntar la web

En `js/data/curated.js`, rellena `CONFIG`:

```js
nowPlayingUrl: "https://TU-HOST/observatorio/nowplaying.json",
statsUrl:      "https://TU-HOST/observatorio/stats.json",
```

Recarga la web: los paneles pasan de `○ sim` a `● live` automáticamente.

## Variables de entorno

| Var | Defecto | Para qué |
|---|---|---|
| `OBS_OUT_DIR` | `/var/www/observatorio` | dónde escribir los JSON |
| `SOUNDSIBLE_URL` | `http://127.0.0.1:5005` | Soundsible local |
| `SOUNDSIBLE_TOKEN` | (vacío) | token si exige auth |
| `OBS_SERVICES` | `postgres nginx soundsible tailscaled` | servicios a vigilar |
