.PHONY: help dev-local dev-prod build up down logs clean

help:
	@echo "Available commands:"
	@echo "  make dev-local    - Start services for local development"
	@echo "  make dev-prod     - Start services for production"
	@echo "  make build        - Build Docker images"
	@echo "  make up           - Start services (requires env file)"
	@echo "  make down         - Stop services"
	@echo "  make logs         - View logs"
	@echo "  make clean        - Stop services and remove volumes"

dev-local:
	@echo "Starting services for local development..."
	docker-compose --env-file .env.local up -d
	@echo "Services started!"
	@echo "Frontend: http://book.sparkco.localhost"
	@echo "Backend: http://api.book.sparkco.localhost"
	@echo "Traefik Dashboard: http://traefik.sparkco.localhost:8080"

dev-prod:
	@echo "Starting services for production..."
	docker-compose --env-file .env.prod up -d
	@echo "Services started!"
	@echo "Frontend: http://book.sparkco.vip"
	@echo "Backend: http://api.book.sparkco.vip"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	@echo "All services stopped and volumes removed"
