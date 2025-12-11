import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import mongoose from 'mongoose';

// Cache connection
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) return;

    if (mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI!);
        isConnected = true;
        console.log('MongoDB Connected (Vercel)');
    } catch (error) {
        console.error('MongoDB Connection Check Error:', error);
    }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await connectToDatabase();
    // Forward request to Express app
    // Express apps are valid request listeners
    app(req, res);
}
