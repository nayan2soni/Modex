# Modex Deployment Guide

## Prerequisites
- **GitHub Account**: To host the code.
- **Render Account**: For Backend + MongoDB support.
- **Vercel Account**: For Frontend.
- **MongoDB Atlas URI** (or use Render's managed MongoDB if available options allow, otherwise Atlas is recommended).

## 1. Backend Deployment (Render)

1. **Push Code to GitHub**:
   - Initialize git in `backend/` or root `Modex/`.
   - Push to a new repository.

2. **Create Web Service on Render**:
   - Connect your GitHub repo.
   - Root Directory: `backend`.
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - **Environment Variables**:
     - `MONGO_URI`: Your MongoDB connection string.
     - `PORT`: `3000` (Render usually sets this automatically, but `npm start` uses it).

3. **Verify**:
   - Once deployed, copy the **Backend URL** (e.g., `https://modex-backend.onrender.com`).
   - Test endpoints: `GET /api/shows` (should return empty list or shows).

## 2. Frontend Deployment (Vercel)

1. **Create New Project on Vercel**:
   - Import the same GitHub repo.
   - Root Directory: `frontend`.
   - Framework Preset: `Vite`.
   - **Environment Variables**:
     - `VITE_API_URL`: The **Backend URL** from step 1 (e.g., `https://modex-backend.onrender.com/api`).
       - *Note: Ensure you append `/api` if your client expects it, or just the base URL if client appends `/api`.*
       - *Check `src/api/client.ts`: it uses param content `|| 'http://localhost:3000/api'`. So set it to `https://.../api`.*

2. **Deploy**:
   - Click Deploy.
   - Vercel will build and serve the app.

3. **Verify**:
   - Open the Vercel URL.
   - You should see the `Modex Shows` homepage.

## 3. Post-Deployment
- Go to `/admin` to create some shows.
- Go to `/` to view and book seats.
