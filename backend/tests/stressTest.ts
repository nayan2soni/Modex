import axios from 'axios';
import mongoose from 'mongoose';

const API_URL = 'http://localhost:3000/api';

async function runStressTest() {
    try {
        console.log('--- Starting Concurrency Stress Test ---');

        // 1. Create a Show (Admin)
        console.log('Creating Test Show...');
        const showRes = await axios.post(`${API_URL}/admin/shows`, {
            title: 'Stress Test Show',
            startTime: new Date(),
            venueHall: 'Virtual Hall',
            totalSeats: 50,
            price: 100
        });

        const showId = showRes.data.show._id;
        const seats = await axios.get(`${API_URL}/shows/${showId}/seats`);
        const targetSeat = seats.data[0]; // Pick the first seat to fight over

        console.log(`Targeting Seat: ${targetSeat.row}${targetSeat.number} (ID: ${targetSeat._id})`);

        // 2. Launch 20 concurrent booking requests for the SAME seat
        const concurrentRequests = 20;
        console.log(`Launching ${concurrentRequests} concurrent booking requests...`);

        const promises = [];
        for (let i = 0; i < concurrentRequests; i++) {
            const userId = new mongoose.Types.ObjectId();
            promises.push(
                axios.post(`${API_URL}/shows/${showId}/book`, {
                    userId: userId,
                    seatIds: [targetSeat._id]
                }).then(res => ({ status: 'success', data: res.data }))
                    .catch(err => ({ status: 'failed', error: err.response?.data || err.message }))
            );
        }

        const results = await Promise.all(promises);

        // 3. Analyze Results
        const successes = results.filter(r => r.status === 'success');
        const failures = results.filter(r => r.status === 'failed');

        console.log('--- Results ---');
        console.log(`Total Requests: ${concurrentRequests}`);
        console.log(`Successes: ${successes.length}`);
        console.log(`Failures: ${failures.length}`);

        if (successes.length === 1 && failures.length === concurrentRequests - 1) {
            console.log('PASSED: Only 1 booking succeeded. Overbooking prevented.');
        } else if (successes.length === 0) {
            console.log('FAILED: No bookings succeeded (Check errors).');
            console.log(failures[0]);
        } else {
            console.log('FAILED: Overbooking detected! Multiple successes.');
            console.log('Ensure atomic locks are working.');
        }

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

// Slightly delayed start to allow server to be ready if run immediately
setTimeout(runStressTest, 2000);
