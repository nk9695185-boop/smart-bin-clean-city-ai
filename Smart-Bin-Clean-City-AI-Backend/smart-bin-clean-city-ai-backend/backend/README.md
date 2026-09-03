# Smart Bin & Clean City AI — Backend

## 1. Requirements
- Node.js 20+
- PostgreSQL 15+

## 2. Setup
```powershell
cd backend
npm install
copy .env.example .env
```
Edit `.env` with your PostgreSQL credentials.

Create database `smart_city_ai`, then run `schema.sql` with psql or pgAdmin.

## 3. Start
```powershell
npm run dev
```
API: `http://localhost:5000`
Health: `GET /api/health`

## Core endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/dashboard`
- GET `/api/bins`
- POST `/api/bins/:id/sensor-data`
- GET `/api/products`
- POST `/api/products`
- GET `/api/products/:productId/trace`
- POST `/api/products/:productId/events`
- GET `/api/incidents`
- POST `/api/incidents`
- PATCH `/api/incidents/:id`
