# Modex Ticket Booking Service - Implementation Plan

# Goal Description
Develop a full-stack ticket booking system (Node.js/Express backend + React/TS frontend) that handles concurrent seat bookings safely without overbooking. The system must be production-ready, deployed, and fully documented.

## User Review Required
> [!IMPORTANT]
> **Concurrency Strategy**: We will use **PostgreSQL Row-Level Locking (`SELECT ... FOR UPDATE`)** within a transaction to ensure atomic seat booking. This is the "safest" approach recommended by the requirements.
>
> **Tech Stack Selection**:
> - Backend: Node.js, Express, Prisma ORM, PostgreSQL.
> - Frontend: Vite, React, TypeScript, Tailwind CSS, Context API.
> - Deployment: Render (Backend + DB), Vercel (Frontend).
>
> **Deployment Constraints**: The agent will prepare all code and configuration. Since auto-deployment agents often lack credentials, I will provide the steps and scripts to deploy, but might need user assistance to auth if CLIs are used.

## Proposed Changes

### Backend (`/backend`)
#### [NEW] [package.json](file:///c:/Users/nayan/Downloads/Modex/backend/package.json)
- Express, Mongoose, dotenv, typescript, jest, supertest, nodemon.

#### [NEW] [src/models/Show.ts, Seat.ts, Booking.ts](file:///c:/Users/nayan/Downloads/Modex/backend/src/models/)
- **Show**: `name`, `startTime`, `totalSeats`
- **Seat**: `showId`, `row`, `number`, `status` (AVAILABLE, BOOKED), `bookingId`
- **Booking**: `userId`, `showId`, `seats` (Ref array), `status` (CONFIRMED, FAILED), `createdAt`

#### [NEW] [src/controllers/bookingController.ts](file:///c:/Users/nayan/Downloads/Modex/backend/src/controllers/bookingController.ts)
- `bookSeats`: Atomic Logic with MongoDB.
    1. Loop through requested seat IDs.
    2. Attempt `Seat.findOneAndUpdate({ _id: seatId, status: 'AVAILABLE' }, { status: 'BOOKED', bookingId: ... }, { new: true })`
    3. If any update returns null (collision), Rollback (revert successful locks) and Error.
    4. If all succeed, create Booking record.
    5. (Alternatively use MongoDB Transactions if Replica Set is available, but atomic findOneAndUpdate is safer for single instance reliability).

### Frontend (`/frontend`)
#### [NEW] [src/components/SeatMap.tsx](file:///c:/Users/nayan/Downloads/Modex/frontend/src/components/SeatMap.tsx)
- Visual grid of seats.
- Optimistic UI updates but robust error handling for concurrency failures ("Someone just booked this!").

## Verification Plan

### Automated Tests
- **Concurrency Stress Test**: A script triggering 50 concurrent requests for the same seat.
    - Expected Result: Only 1 succeeds, 49 fail with "Seat unavailable".
- **Unit Tests**: Jest tests for booking logic services.

### Manual Verification
- Deploy to Render/Vercel.
- Open two browser windows.
- Select same seat in both.
- Click "Book" simultaneously.
- Verify one wins, one gets error message.
