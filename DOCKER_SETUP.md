# Docker + Traefik Setup Guide

This project is configured to run with Docker and Traefik reverse proxy.

## Prerequisites

- Docker and Docker Compose installed
- For local development: Add to `/etc/hosts`:
  ```
  127.0.0.1 book.sparkco.localhost
  127.0.0.1 api.book.sparkco.localhost
  ```

## Environment Configuration

### Local Development

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your local settings:
   ```env
   BASE_DOMAIN=sparkco.localhost
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=appointment
   JWT_SECRET=your_super_secret_key_local
   ```

### Production

1. Copy `.env.prod.example` to `.env.prod`:
   ```bash
   cp .env.prod.example .env.prod
   ```

2. Edit `.env.prod` with your production settings:
   ```env
   BASE_DOMAIN=sparkco.vip
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_secure_password_here
   DATABASE_NAME=appointment
   JWT_SECRET=your_super_secret_key_production
   ```

## Running the Application

### Local Development

```bash
# Load environment variables and start services
docker-compose --env-file .env.local up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at:
- Frontend: http://book.sparkco.localhost
- Backend API: http://api.book.sparkco.localhost
- Traefik Dashboard: http://traefik.sparkco.localhost:8080

### Production

```bash
# Load environment variables and start services
docker-compose --env-file .env.prod up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at:
- Frontend: http://book.sparkco.vip
- Backend API: http://api.book.sparkco.vip

## Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

## Database

The PostgreSQL database is automatically created and managed by Docker Compose. Data is persisted in a Docker volume named `postgres_data`.

To reset the database:
```bash
docker-compose down -v  # This removes volumes
docker-compose up -d
```

## Services

- **traefik**: Reverse proxy and load balancer
- **postgres**: PostgreSQL database
- **backend**: NestJS API server
- **frontend**: Next.js frontend application

## Troubleshooting

1. **Port conflicts**: Make sure ports 80, 443, and 8080 are not in use
2. **Domain resolution**: Ensure `/etc/hosts` entries are correct for local development
3. **Environment variables**: Verify `.env.local` or `.env.prod` file exists and has correct values
4. **Build issues**: Try rebuilding images with `docker-compose build --no-cache`
