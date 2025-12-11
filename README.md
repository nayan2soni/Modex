# Modex Full-Stack Ticket Booking System

A high-concurrency ticket booking platform built with **Node.js, Express, MongoDB, and React**. This system is designed to handle simultaneous booking requests for the same seat without overbooking, utilizing atomic document updates. It is fully deployed on **Vercel** (Serverless Backend + Static Frontend) with **MongoDB Atlas**.

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT Authentication**: Secure user registration and login flows.
- **Protected Routes**: Booking capabilities are restricted to authenticated users.
- **Password Hashing**: Industry-standard `bcrypt` security.

### 🎟️ Booking & Concurrency
- **Atomic Booking**: Prevents double-booking using MongoDB `findOneAndUpdate` atomic operators.
- **Real-Time Availability**: Seat status is checked atomically at the moment of booking.
- **Sold Out Indicators**: Shows automatically display "Sold Out" badges when full.

### 🎨 Advanced UI/UX
- **Interactive Seat Map**: 
    - **PC**: Click and drag to mass-select seats ("Paint Selection").
    - **Mobile**: Long-press and slide to select multiple seats.
- **Responsive Design**: Fully mobile-optimized layouts with `overflow` handling.
- **Modern Aesthetics**: Glassmorphism visuals, smooth transitions, and premium typography using Tailwind CSS.
- **Success Modal**: Beautiful "Booking Confirmed" pop-up with Email confirmation note.

---

## 🚀 Live Demo
- **Frontend**: [Hosted on Vercel](https://modex-lzpj.vercel.app/)
- **Backend API**: [Hosted on Vercel Serverless](https://modex-lzpj.vercel.app/api/shows)

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, TypeScript, Mongoose (Vercel Serverless Function adapter)
- **Database**: MongoDB Atlas (Free Tier)
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Deployment**: Vercel (Monorepo deployment)

---

## 🏃‍♂️ Local Setup Instructions

### 1. Backend Setup
1. Navigate to the backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env`:
   ```env
   MONGO_URI=mongodb+srv://<your_connection_string>
   JWT_SECRET=your_secret_key
   PORT=3000
   ```
4. Start server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start React dev server:
   ```bash
   npm run dev
   ```

### 3. Database Seeding
To populate your database with initial show data:
```bash
cd backend
npx ts-node seedProduction.ts
```

---

## 🧪 Testing Concurrency
To simulate 20 simultaneous booking requests for the same seat:
```bash
cd backend
npx ts-node tests/stressTest.ts
```
**Expected Result**: 1 Success, 19 Failures (409 Conflict).

---

## 📦 Deployment Guide
This project is configured for **100% Free Hosting** on Vercel.

1. **Database**: Create a free cluster on MongoDB Atlas.
2. **Push to GitHub**: Ensure `backend` and `frontend` folders are in the repo.
3. **Vercel Backend**:
   - Create project linked to `backend` folder.
   - Add `MONGO_URI` and `JWT_SECRET` env vars.
   - Deploy (It uses `api/index.ts` as the Serverless Entry Point).
4. **Vercel Frontend**:
   - Create project linked to `frontend` folder.
   - Add `VITE_API_URL` env var (e.g., `https://your-backend.vercel.app/api`).
   - Deploy.

Enjoy the show! 🍿
