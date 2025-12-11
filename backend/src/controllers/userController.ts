import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Show from '../models/Show';
import Seat from '../models/Seat';
import Booking from '../models/Booking';

export const listShows = async (req: Request, res: Response) => {
    try {
        const shows = await Show.find().sort({ startTime: 1 }).lean();

        const showsWithAvailability = await Promise.all(shows.map(async (show) => {
            const availableCount = await Seat.countDocuments({ showId: show._id, status: 'AVAILABLE' });
            return { ...show, availableSeats: availableCount };
        }));

        res.status(200).json(showsWithAvailability);
    } catch (error) {
        console.error('List Shows Error:', error);
        res.status(500).json({ message: 'Server error fetching shows' });
    }
};

export const getShowSeats = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const seats = await Seat.find({ showId: id }).sort({ row: 1, number: 1 });
        if (!seats.length) {
            return res.status(404).json({ message: 'Show not found or no seats available' });
        }
        res.status(200).json(seats);
    } catch (error) {
        console.error('Get Seats Error:', error);
        res.status(500).json({ message: 'Server error fetching seats' });
    }
};

export const bookSeats = async (req: Request, res: Response) => {
    try {
        const { id: showId } = req.params;
        const { seatIds, userId } = req.body; // Expecting userId for now

        if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
            return res.status(400).json({ message: 'No seats selected' });
        }

        // 1. Generate a temporary booking ID (or just use a unique batch ID) to lock these seats
        // We will use a Mongoose ID.
        const tempBookingId = new mongoose.Types.ObjectId();

        // 2. ATOMIC UPDATE ATTEMPT
        const seatObjectIds = seatIds.map((id: string) => new mongoose.Types.ObjectId(id));
        const showObjectId = new mongoose.Types.ObjectId(showId);

        console.log(`[DEBUG] Attempting book. Show: ${showId}, Seats: ${seatIds.join(',')}`);
        console.log(`[DEBUG] Query criteria: { _id: { $in: ${seatObjectIds} }, showId: ${showObjectId}, status: 'AVAILABLE' }`);

        // Try to set all requested seats to BOOKED *only if* they are currently AVAILABLE.
        const updateResult = await Seat.updateMany(
            {
                _id: { $in: seatObjectIds },
                showId: showObjectId,
                status: 'AVAILABLE'
            },
            {
                $set: {
                    status: 'BOOKED',
                    bookingId: tempBookingId
                }
            }
        );

        console.log(`[DEBUG] Update result: matched=${updateResult.matchedCount}, modified=${updateResult.modifiedCount}, acknowledged=${updateResult.acknowledged}`);

        // 3. VERIFICATION
        if (updateResult.modifiedCount !== seatIds.length) {
            // FAILURE: Not all selected seats were available.
            // Some might have been locked by this very request, others failed.
            // We must ROLLBACK any that we successfully locked.

            await Seat.updateMany(
                { bookingId: tempBookingId },
                {
                    $set: {
                        status: 'AVAILABLE',
                        bookingId: null
                    }
                }
            );

            return res.status(409).json({
                message: 'One or more selected seats are no longer available. Please try again.',
                error: 'CONCURRENCY_CONFLICT'
            });
        }

        // 4. SUCCESS - Create Booking Record
        // Calculate total amount (fetch one seat to get price via show, or fetch show)
        const show = await Show.findById(showId);
        if (!show) {
            // Should technically roll back here too if show is gone, though unlikely
            await Seat.updateMany({ bookingId: tempBookingId }, { $set: { status: 'AVAILABLE', bookingId: null } });
            return res.status(404).json({ message: 'Show not found' });
        }

        const totalAmount = show.price * seatIds.length;

        const booking = new Booking({
            _id: tempBookingId, // Use the same ID for consistency if possible, or new one. 
            // Actually Booking._id and Seat.bookingId should match.
            // In step 2 we set Seat.bookingId to tempBookingId.
            userId: userId || new mongoose.Types.ObjectId(), // Guest/Demo user
            showId,
            seats: seatIds,
            totalAmount,
            status: 'CONFIRMED'
        });

        await booking.save();

        res.status(201).json({
            message: 'Booking confirmed',
            bookingId: booking._id,
            seats: seatIds
        });

    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ message: 'Server error processing booking' });
    }
};

export const getBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate('seats').populate('showId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching booking' });
    }
}
