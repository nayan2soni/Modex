# Modex Video Explanation Script

## Intro (0:00 - 0:30)
- **Speaker**: "Hi, this is the Modex Full-Stack Ticket Booking System."
- **Visual**: Show the **Architecture Diagram**.
- **Speaker**: "We built a high-concurrency booking platform using Node.js, Express, MongoDB, and React."
- **Key Feature**: "The core challenge was handling concurrent seat bookings without overbooking. We solved this using **Atomic Document Updates** with Mongoose."
- **Visual**: Show `userController.ts` code snippet (the `bookSeats` function).

## Demo - Admin (0:30 - 1:00)
- **Visual**: Open the **Admin Dashboard** (`/admin`).
- **Action**: Create a new show: "Avengers Premiere", Venue: "Hall 1", Price: "15".
- **Speaker**: "Determining the show details triggers the backend to automatically generate seat layout for the venue."

## Demo - User Booking & Concurrency (1:00 - 2:00)
- **Visual**: Open **Show List** (Homepage). Click "Book Seats".
- **Visual**: Show the **Seat Map**.
- **Action**: Select seats A1, A2.
- **Speaker**: "Here we see the interactive seat map. Red seats are booked, Green are selected."
- **Visual**: **Split Screen**. Show **Terminal** running the `stressTest.ts`.
- **Action**: Run the stress test: `npx ts-node tests/stressTest.ts`.
- **Speaker**: "We are now simulating 20 users trying to book the exact same seat simultaneously."
- **Visual**: Show Terminal Output: `Successes: 1, Failures: 19`.
- **Speaker**: "As you can see, our atomic locking mechanism ensured only ONE user got the seat. The others received a polite 'Concurrency Conflict' error."

## Technical Deep Dive (2:00 - 2:45)
- **Visual**: Show `deployment_guide.md` or Vercel Dashboard.
- **Speaker**: "The backend is stateless and deployed on Render. The frontend is on Vercel."
- **Speaker**: "We use a robust error handling strategy and optimistic UI updates."

## Outro (2:45 - 3:00)
- **Speaker**: "Modex is ready for scale. Thanks for watching."
