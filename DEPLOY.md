# Deployment: Traefik + App (local and server)

This project runs **PostgreSQL**, **NestJS**, and **Next.js** behind **Traefik**. The app Compose files expect an external Docker network named `traefik`. The file `docker-compose.traefik.yml` in this repo creates that network and runs Traefik.

---

## Prerequisites

- Docker and Docker Compose v2 (`docker compose`)
- Host ports **80**, **8080** free (production also **443**)
- For **local**: map hostnames to this machine (see below)
- For **production**: DNS **A** (or **AAAA**) records for `book.sparkco.vip` and `api.book.sparkco.vip` pointing to the server’s public IP

---

## 0. Dry run (validate Compose)

Before starting Traefik or the app stack, confirm Compose files parse and variables interpolate (does not start containers):

```bash
docker compose -f docker-compose.traefik.yml --profile local config >/dev/null
cp .env.local.example .env.local   # edit secrets if needed
docker compose --env-file .env.local -f docker-compose.local.yml config >/dev/null
```

---

## 1. Environment files

| File | Purpose |
|------|---------|
| [.env.local.example](.env.local.example) | Copy to `.env.local` for your PC |
| [.env.prod.example](.env.prod.example) | Copy to `.env.prod` on the server |

```bash
cp .env.local.example .env.local
# edit .env.local

# on server:
cp .env.prod.example .env.prod
# edit .env.prod — set DATABASE_PASSWORD, JWT_SECRET, ACME_EMAIL
```

---

## 2. Start Traefik (creates network `traefik`)

**Local — HTTP only (entrypoint `web` on port 80):**

```bash
docker compose -f docker-compose.traefik.yml --profile local up -d
```

**Production — HTTP (80) + HTTPS (443) + Let’s Encrypt (resolver name `letsencrypt`):**

```bash
export ACME_EMAIL=you@yourdomain.com
docker compose -f docker-compose.traefik.yml --profile production up -d
```

- Traefik dashboard: `http://<host>:8080` (insecure API; do not expose publicly without a firewall)
- Stop Traefik: `docker compose -f docker-compose.traefik.yml --profile local down`  
  (or `--profile production`)

---

## 3. Local machine: `/etc/hosts`

Point these to `127.0.0.1` (or your LAN IP if Docker runs elsewhere):

```
127.0.0.1 book.sparkco.localhost
127.0.0.1 api.book.sparkco.localhost
```

---

## 4. Start the application

**Local (uses [docker-compose.local.yml](docker-compose.local.yml)):**

```bash
docker compose --env-file .env.local -f docker-compose.local.yml up -d --build
```

- App: `http://book.sparkco.localhost`
- API: `http://api.book.sparkco.localhost`

**Stop:**

```bash
docker compose --env-file .env.local -f docker-compose.local.yml down
```

---

## 5. Production server (`sparkco.vip`)

1. Configure DNS for `book.sparkco.vip` and `api.book.sparkco.vip`.
2. Set `ACME_EMAIL` and start Traefik with the **production** profile (section 2).
3. Ensure `.env.prod` matches [`.env.prod.example`](.env.prod.example) (strong `DATABASE_PASSWORD` and `JWT_SECRET`).
4. Start the stack:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

- Site: `https://book.sparkco.vip`
- API: `https://api.book.sparkco.vip`

**Stop:**

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml down
```

---

## 6. Alternative: default Compose file

[docker-compose.yml](docker-compose.yml) matches the **local** hostnames (`book.sparkco.localhost`). You can use:

```bash
docker compose --env-file .env.local -f docker-compose.yml up -d --build
```

---

## 7. Troubleshooting

| Issue | What to check |
|-------|----------------|
| `network traefik declared as external, but could not be found` | Start Traefik first (section 2). |
| Let’s Encrypt fails | Port **80** must reach Traefik from the internet; DNS must point to this server; `ACME_EMAIL` set. |
| CORS errors in the browser (prod) | Backend uses `FRONTEND_ORIGIN` (set in Compose) — must match the frontend URL (`https://book.<BASE_DOMAIN>`). |
| Nest refuses to start | In production, `JWT_SECRET` must not be `your_super_secret_key` and `DATABASE_PASSWORD` must not be `postgres`. |

---

## 8. Order of operations (checklist)

1. Traefik: `docker compose -f docker-compose.traefik.yml --profile local` (or `production`) `up -d`
2. Copy and edit `.env.local` or `.env.prod`
3. App: `docker compose --env-file ... -f docker-compose.local.yml` (or `docker-compose.prod.yml`) `up -d --build`
