# Modex Full-Stack Ticket Booking System

A high-concurrency ticket booking platform built with Node.js, Express, MongoDB, and React. This system is designed to handle simultaneous booking requests for the same seat without overbooking, utilizing atomic document updates.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Git

### 1. Backend Setup
The backend is an Express server handling API requests and managing database concurrency.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=mongodb+srv://<your_connection_string>
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

### 2. Frontend Setup
The frontend is a React application built with Vite and Tailwind CSS.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).

### 3. Running Stress Tests
To verify the concurrency logic (preventing double bookings):

1. Ensure the backend is running.
2. Run the stress test script from the `backend` directory:
   ```bash
   npx ts-node tests/stressTest.ts
   ```
   This simulates 20 simultaneous booking requests for the same seat. You should see **1 Success** and **19 Failures**.

## 🧠 Assumptions Made

1. **Authentication Scope**: For this assessment, we focused on the core **concurrency** challenge. A full authentication system (JWT/OAuth) was omitted to prioritize the booking logic and stress testing. Users are identified by simple User IDs passed in requests.
2. **Admin Access**: The Admin Dashboard (`/admin`) is open. In a production scenario, this would be protected by robust role-based access control.
3. **Database**: We assume a MongoDB replica set or compatible environment (Atlas) that supports standard ACID transactions if needed, though our solution primarily uses **atomic operators** (`findOneAndUpdate` / `updateMany`) which work on standalone instances as well.
4. **Environment**: The application is configured to run locally on ports 3000 (API) and 5173 (Client).

## ⚠️ Known Limitations

1. **Real-time Updates**: The current implementation uses **polling** (every 5 seconds) to refresh the seat map. A production-grade version would use **WebSockets (Socket.io)** for instant seat status updates to all connected clients.
2. **Payment Processing**: The booking flow mocks the payment step. "Confirmed" status is granted immediately upon successful seat locking.
3. **Seat Hold Timer**: We implemented a basic "Pending" state, but the automatic expiration of held seats (e.g., releasing a seat if payment isn't made in 5 mins) is not fully automated with a background job (cron/agenda) in this version.
4. **Error Handling**: While concurrency errors are handled gracefully, input validation is basic.
