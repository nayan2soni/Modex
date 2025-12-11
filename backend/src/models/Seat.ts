import mongoose, { Schema, Document } from 'mongoose';

export interface ISeat extends Document {
    showId: mongoose.Types.ObjectId;
    row: string;
    number: number;
    status: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
    bookingId?: mongoose.Types.ObjectId;
}

const SeatSchema: Schema = new Schema({
    showId: { type: Schema.Types.ObjectId, ref: 'Show', required: true },
    row: { type: String, required: true },
    number: { type: Number, required: true },
    status: {
        type: String,
        enum: ['AVAILABLE', 'LOCKED', 'BOOKED'],
        default: 'AVAILABLE'
    },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' }
}, {
    timestamps: true
});

// Compound index for unique seats in a show
SeatSchema.index({ showId: 1, row: 1, number: 1 }, { unique: true });
// Index for concurrency queries
SeatSchema.index({ showId: 1, status: 1 });

export default mongoose.model<ISeat>('Seat', SeatSchema);
