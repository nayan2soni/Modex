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
        // Enforce 5s timeout on connection to fail fast
        await mongoose.connect(process.env.MONGO_URI!, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = true;
        console.log('MongoDB Connected (Vercel)');
    } catch (error) {
        console.error('MongoDB Connection Check Error:', error);
        throw error; // Re-throw to handle in handler
    }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        await connectToDatabase();
        // Forward request to Express app
        // Express apps are valid request listeners
        app(req, res);
    } catch (error: any) {
        res.status(500).json({
            message: 'Database Connection Failed',
            error: error.message,
            stack: error.stack
        });
    }
}
