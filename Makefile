# Container starten
start:
	docker-compose up -d

# Container stoppen
down:
	docker-compose down

# Container neu builden & starten
build:
	docker-compose up -d --build

# Logs anzeigen
logs:
	docker-compose logs -f

# Backend in den Container starten
backend:
	docker-compose run --rm backend /bin/sh

# Frontend in den Container starten
frontend:
	docker-compose run --rm frontend /bin/sh

# Mailcatcher Webinterface öffnen
mail:
	echo "MailCatcher läuft unter http://localhost:1080"

# Docker Cleanup
clean:
	docker-compose down --rmi all --volumes --remove-orphans

# Enter Frontend Container
make terminal-frontend:
	docker exec -it my-wiki-frontend-1 /bin/bash

# Enter Backend Container
make terminal-backend:
	docker exec -it my-wiki-backend-1 /bin/bash