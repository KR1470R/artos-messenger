# Stage 1: Build the frontend
FROM node:18-alpine AS frontend_builder
RUN mkdir -p /app/frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend
FROM node:18-alpine AS backend_builder
RUN mkdir -p /app/backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Final stage to serve both frontend and backend
FROM node:18-alpine
WORKDIR /app
COPY --from=backend_builder /app/backend/dist ./backend/dist
COPY --from=backend_builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend_builder /app/backend/configs ./backend/configs
COPY --from=backend_builder /app/backend/tsconfig.* ./backend/
COPY backend/package*.json ./backend/
COPY --from=frontend_builder /app/frontend/build ./frontend/build

# Expose the backend port
EXPOSE ${APP_PORT}

# Start the backend server and serve the frontend statically
WORKDIR /app/backend

CMD ["npm", "run", "start:dev"]