import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    showId: mongoose.Types.ObjectId;
    seats: mongoose.Types.ObjectId[];
    totalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'EXPIRED';
    expiresAt?: Date;
}

const BookingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Can be nullable if guest system
    showId: { type: Schema.Types.ObjectId, ref: 'Show', required: true },
    seats: [{ type: Schema.Types.ObjectId, ref: 'Seat', required: true }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'FAILED', 'EXPIRED'],
        default: 'PENDING'
    },
    expiresAt: { type: Date }
}, {
    timestamps: true
});

// Index to help find expired bookings
BookingSchema.index({ status: 1, expiresAt: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
