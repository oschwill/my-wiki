# --- Base Stage ---
FROM node:22.14.0 AS base
WORKDIR /app

# --- Backend Stage ---
FROM base AS backend
WORKDIR /app/backend
COPY backend/package*.json ./ 
RUN npm install 
COPY backend .  
RUN npm install -g nodemon
CMD ["npm", "run", "dev"]
EXPOSE ${PORT}

# --- Frontend Stage ---
FROM base AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./ 
COPY frontend . 
RUN npm install  
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
EXPOSE 3000

# --- CMS Stage ---
FROM base AS cms
WORKDIR /app/cms
COPY cms/package*.json ./
RUN npm install
COPY cms .
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3001"]
EXPOSE 3001