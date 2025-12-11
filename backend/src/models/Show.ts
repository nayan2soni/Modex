import mongoose, { Schema, Document } from 'mongoose';

export interface IShow extends Document {
    title: string;
    description?: string;
    startTime: Date;
    venueHall: string;
    totalSeats: number;
    price: number;
}

const ShowSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    venueHall: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    price: { type: Number, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IShow>('Show', ShowSchema);
