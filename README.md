# Welcome to Quantro Dashboard

## 🎥 Demo Video

**Watch the Quantro Dashboard in action:**

[![Watch the video](https://img.shields.io/badge/Watch%20Demo-Video-blue?style=for-the-badge)](media/Quantro%20Dashboard%20Video.mp4)

[Download Demo Video](media/Quantro%20Dashboard%20Video.mp4) or view it directly in the `/media` folder.

---

## 📱 About

This project is now configured as a fullstack app (frontend + backend + MongoDB).

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:4000/api
- **Database:** MongoDB (localhost:27017/quantro-dashboard)

## Setup

1. **Install MongoDB** (if not already installed):
   - Download from https://www.mongodb.com/try/download/community
   - Start MongoDB service: `mongod` (or install as service)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

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

