# System Design Document - Modex Ticket Booking System

## 1. High-Level Architecture

The system follows a standard 3-tier architecture:
- **Client (Frontend)**: React Single Page Application (SPA) hosted on Vercel. Interacts with the backend via REST APIs.
- **Server (Backend)**: Node.js/Express REST API hosted on Render/Railway. Stateless architecture for horizontal scaling.
- **Database**: MongoDB (Atlas/Railway). Document store for flexible schema and high write throughput.

### Diagram
(See `architecture_diagram.md` for visual representation)

## 2. Database Schema (Mongoose Schemas)

#### `User` (Optional/MVP)
- `_id`: ObjectId
- `email`: String (Unique)
- `name`: String

#### `Show`
- `_id`: ObjectId
- `title`: String
- `start_time`: Date
- `total_seats`: Number

#### `Seat`
- `_id`: ObjectId
- `show_id`: ObjectId (Ref Show)
- `row_number`: String
- `seat_number`: Number
- `status`: String ('AVAILABLE', 'BOOKED')
- `booking_id`: ObjectId (Ref Booking)

#### `Booking`
- `_id`: ObjectId
- `user_id`: ObjectId (Ref User)
- `show_id`: ObjectId (Ref Show)
- `seats`: [ObjectId] (Ref Seat)
- `status`: String ('CONFIRMED', 'FAILED')
- `created_at`: Date

## 3. Concurrency & Locking Strategy

**Problem**: Multiple users trying to book the same seat at the same millisecond.
**Solution**: **Atomic Document Updates (`findOneAndUpdate`)**.

### Workflow
1. **Receive Request**: User wants seats [A1, A2].
2. **Atomic Lock Loop**:
   For each seat in list:
   `result = await Seat.findOneAndUpdate({ _id: seatId, status: 'AVAILABLE' }, { status: 'BOOKED', bookingId: newBookingId });`
   - If `result` is null, the seat was already taken. **FAIL** the entire request.
3. **Rollback (Compensating Transaction)**:
   - If one fails (e.g., A1 succeeded, A2 failed), we must **Release** A1 immediately:
   `await Seat.updateOne({ _id: A1 }, { status: 'AVAILABLE', bookingId: null });`
   - Return error to user.
4. **Success**:
   - If all succeed, return CONFIRMED.

This provides strong consistency without needing multi-document transactions (though transactions are available in MongoDB Replica Sets, this approach is robust even on standalone).

## 4. Scaling Strategy

### Application Layer (Node.js)
- **Stateless**: No local sessions.
- **Horizontal Scaling**: Multiple clones.

### Database Layer (MongoDB)
- **Sharding**: Can shard by `show_id` if we grow massive.
- **Replica Sets**: For high availability and read scaling.

### caching (Redis - Optional Phase 2)
- Cache `GET /shows` and `GET /shows/:id/seats` responses.
- Invalidate cache when admin creates a show or a booking occurs.

## 5. API Design

### Admin
- `POST /api/admin/shows`: Create a show (and auto-generate availability seats).
- `GET /api/admin/shows`: List all shows.

### User
- `GET /api/shows`: List active shows.
- `GET /api/shows/:id/seats`: Get seat map with status.
- `POST /api/shows/:id/book`: Atomic booking transaction.
    - Body: `{ seatIds: string[], userId: string }`
    - Response: `{ bookingId: string, status: 'CONFIRMED' }`
