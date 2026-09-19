🚀 Dockerized Node.js + React + Payload CMS + Mailcatcher

📌 Projektbeschreibung

Dieses Projekt stellt ein Fullstack-Setup bereit, bestehend aus:

Node.js (Backend mit Express.js & MongoDB)

React.js (Frontend)

Payload CMS (Headless CMS mit MongoDB)

MailCatcher (zum Testen von E-Mails)

Docker + Docker-Compose

🔧 Installation & Start

1️⃣ Voraussetzungen

Folgende Komponenten müssen installiert sein:

Docker
Docker Compose
Makefile

Zusätzlich müssen die benötigten Umgebungsvariablen konfiguriert werden.

Für das Hauptprojekt:

.env

Für das Payload CMS:

cms/.env

Die jeweiligen Beispiel-Dateien dienen als Vorlage:

.env.example
cms/.env.example

2️⃣ Projekt starten

Das komplette Projekt kann über das Makefile gestartet werden:

make up

Dadurch werden folgende Container gestartet:

Backend
Frontend
Payload CMS
MailCatcher

3️⃣ Logs anzeigen

make logs

4️⃣ Projekt stoppen

make down

5️⃣ Alles zurücksetzen (inkl. Images & Volumes)

make clean

🌍 Endpunkte & URLs

🎨 Frontend

🔹 URL: http://localhost:3000

🚀 Backend (REST API)

🔹 Base URL: http://localhost:9000

📝 Payload CMS

🔹 Admin Interface: http://localhost:3001/admin

📩 MailCatcher

🔹 Web-Interface: http://localhost:1080🔹 SMTP-Server: smtp://mailcatcher:1025

🗄️ MongoDB

🔹 Login your Mongo DB Atlas Cloud => https://account.mongodb.com/account/login?

Das Wiki-Backend und das Payload CMS verwenden getrennte Datenbanken.

🚧 Weiterentwicklung

coming soon...
