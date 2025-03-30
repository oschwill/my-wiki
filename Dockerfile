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
RUN npm install  
COPY frontend . 
RUN npm run build 
CMD ["npm", "run", "dev"]
EXPOSE 3000
