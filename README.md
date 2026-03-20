# Welcome to Quantro Dashboard

This project is now configured as a fullstack app (frontend + backend + SQLite DB).

- Frontend: http://localhost:8080
- Backend API: http://localhost:4000/api

## Setup

1. npm install
2. npm run dev

## Available scripts

- `npm run client` - start Vite frontend
- `npm run backend` - start Express API server
- `npm run dev` - start both frontend and backend concurrently
- `npm run build` - build frontend for production

## Backend API endpoints

- GET `/api/health` - health check
- GET `/api/widgets` - list widgets from SQLite
- POST `/api/widgets` - create widget (body: `{ title, value }`)

## Cleaned files

Removed example test/playwright folders by default for a focused production stack.

