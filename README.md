🚀 Dockerized Node.js + React + Mailcatcher

📌 Projektbeschreibung

Dieses Projekt stellt ein Fullstack-Setup bereit, bestehend aus:

Node.js (Backend mit Express.js & MongoDB)

React.js (Frontend)

MailCatcher (zum Testen von E-Mails)

Docker + Docker-Compose

🔧 Installation & Start

1️⃣ Voraussetzungen

Docker & Docker Compose & Makefile installiert

.env-Datei mit Umgebungsvariablen erstellen (siehe .env.example)

2️⃣ Projekt starten

make up

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

📩 MailCatcher

🔹 Web-Interface: http://localhost:1080🔹 SMTP-Server: smtp://mailcatcher:1025

🗄️ MongoDB

🔹 Login your Mongo DB Atlas Cloud => https://account.mongodb.com/account/login?
