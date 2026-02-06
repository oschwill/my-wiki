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
terminal-frontend:
	docker exec -it my-wiki-frontend-1 /bin/bash

# Enter Backend Container
terminal-backend:
	docker exec -it my-wiki-backend-1 /bin/bash

# Aufruf / Example: make seed-article field=NewFiled val=true or val=false
seed-article:
	node backend/src/migration/migrate.js article $(field) $(val)
seed-area:
	node backend/src/migration/migrate.js area $(field) $(val)
seed-category:
	node backend/src/migration/migrate.js category $(field) $(val)
seed-user:
	node backend/src/migration/migrate.js user $(field) $(val)