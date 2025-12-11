import { Request, Response } from 'express';
import Show from '../models/Show';
import Seat from '../models/Seat';

export const createShow = async (req: Request, res: Response) => {
    try {
        const { title, description, startTime, venueHall, totalSeats, price } = req.body;

        // 1. Create Show
        const show = new Show({
            title,
            description,
            startTime,
            venueHall,
            totalSeats,
            price
        });
        await show.save();

        // 2. Generate Seats
        // Strategy: 10 seats per row.
        // Row A: 1-10, Row B: 1-10...
        const seatsToInsert = [];
        const seatsPerRow = 10;
        const totalRows = Math.ceil(totalSeats / seatsPerRow);
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let seatsGenerated = 0;
        for (let r = 0; r < totalRows; r++) {
            const rowLabel = alphabet[r] || `Row${r + 1}`;
            for (let s = 1; s <= seatsPerRow; s++) {
                if (seatsGenerated >= totalSeats) break;

                seatsToInsert.push({
                    showId: show._id,
                    row: rowLabel,
                    number: s,
                    status: 'AVAILABLE'
                });
                seatsGenerated++;
            }
        }

        await Seat.insertMany(seatsToInsert);

        res.status(201).json({ message: 'Show created successfully', show, seatsCreated: seatsGenerated });
    } catch (error) {
        console.error('Create Show Error:', error);
        res.status(500).json({ message: 'Server error creating show' });
    }
};

export const listShows = async (req: Request, res: Response) => {
    try {
        const shows = await Show.find().sort({ startTime: 1 });
        res.status(200).json(shows);
    } catch (error) {
        console.error('List Shows Error:', error);
        res.status(500).json({ message: 'Server error fetching shows' });
    }
};
