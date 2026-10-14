# Aberdares Backend Makefile - Strictly Scoped Docker Controls
PROJECT_NAME = aberdares-backend
COMPOSE = docker compose -p $(PROJECT_NAME)

.PHONY: up down down-clean logs ps migrate makemigrations createsuperuser seed test shell db-shell

up:
	$(COMPOSE) up -d

up-build:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

down-clean:
	@echo "WARNING: This removes the Postgres volume aberdares_pgdata."
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f

logs-web:
	$(COMPOSE) logs -f aberdares_web

logs-worker:
	$(COMPOSE) logs -f aberdares_worker

ps:
	$(COMPOSE) ps

makemigrations:
	$(COMPOSE) exec aberdares_web python manage.py makemigrations

migrate:
	$(COMPOSE) exec aberdares_web python manage.py migrate

createsuperuser:
	$(COMPOSE) exec aberdares_web python manage.py createsuperuser

seed:
	$(COMPOSE) exec aberdares_web python manage.py seed_demo

test:
	$(COMPOSE) exec aberdares_web pytest

shell:
	$(COMPOSE) exec aberdares_web python manage.py shell

db-shell:
	$(COMPOSE) exec aberdares_db psql -U aberdares_user -d aberdares_db
