import mongoose from 'mongoose';
import Show from './src/models/Show';
import Seat from './src/models/Seat';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const shows = [
    {
        title: "Oppenheimer",
        img: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykIGv7eaP7dF.jpg",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        startTime: new Date(new Date().setHours(18, 0, 0, 0)),
        venueHall: "IMAX Hall 1",
        totalSeats: 0,
        price: 15
    },
    {
        title: "Taylor Swift: The Eras Tour",
        img: "https://image.tmdb.org/t/p/w500/jf3YuSWYj3HMxaY8qAIlr8Y90Z.jpg",
        description: "The cultural phenomenon continues on the big screen! Immerse yourself in this once-in-a-lifetime concert film experience.",
        startTime: new Date(new Date().setHours(20, 0, 0, 0)),
        venueHall: "Dolby Cinema Hall 2",
        totalSeats: 0,
        price: 25
    },
    {
        title: "Hamilton",
        img: "https://image.tmdb.org/t/p/w500/h1B7tW0t399VDjAcWJh8m87469b.jpg",
        description: "The real life of one of America's foremost founding fathers and first Secretary of the Treasury, Alexander Hamilton.",
        startTime: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
        venueHall: "Main Theater",
        totalSeats: 0,
        price: 40
    },
    {
        title: "Avengers: Endgame",
        img: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        description: "The Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        startTime: new Date(new Date().setDate(new Date().getDate() + 2)),
        venueHall: "IMAX Hall 3",
        totalSeats: 0,
        price: 12
    }
];

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS_PER_ROW = 8; // 48 seats per show

const connectDB = async () => {
    // Check for MONGO_URI from env or arg
    const uri = process.env.MONGO_URI || process.argv[2];

    if (!uri) {
        console.error('Please provide MONGO_URI in .env or as argument');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seed = async () => {
    await connectDB();

    console.log('Clearing old data...');
    await Show.deleteMany({});
    await Seat.deleteMany({});

    console.log('Seeding shows...');
    for (const showData of shows) {
        const show = new Show({
            ...showData,
            totalSeats: ROWS.length * COLS_PER_ROW
        });
        await show.save();

        const seats = [];
        for (const row of ROWS) {
            for (let i = 1; i <= COLS_PER_ROW; i++) {
                seats.push({
                    showId: show._id,
                    row: row,
                    number: i,
                    status: 'AVAILABLE'
                });
            }
        }
        await Seat.insertMany(seats);
        console.log(`Created show "${show.title}" with ${seats.length} seats.`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
};

seed();
