import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Show, Seat } from '../types';
import SeatMap from '../components/SeatMap';
import { useBooking } from '../context/BookingContext';

const ShowDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [show, setShow] = useState<Show | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingError, setBookingError] = useState('');
    const { selectedSeats, clearSelection, user } = useBooking();

    useEffect(() => {
        // Fetch Show (Actually endpoint /shows returns list, but we can filter or maybe we need detailed endpoint? 
        // For efficiency, assume we can get list and filter. Ideally backend has GET /shows/:id)
        // My backend list userController doesn't have getShowById specifically, but the list shows all.
        // Let's just fetch seats, if I need show details I might need to filter the list or add endpoint.
        // For now I'll fetch list and find, or just fetch seats.
        api.get('/shows').then(res => {
            const found = res.data.find((s: Show) => s._id === id);
            setShow(found);
        });

        api.get(`/shows/${id}/seats`)
            .then(res => setSeats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        // Setup polling for live updates?
        const interval = setInterval(() => {
            api.get(`/shows/${id}/seats`).then(res => setSeats(res.data)).catch(() => { });
        }, 5000); // 5 sec poll

        return () => clearInterval(interval);
    }, [id]);

    const handleBook = async () => {
        if (!show) return;
        setBookingError('');
        try {
            await api.post(`/shows/${id}/book`, {
                seatIds: selectedSeats,
                userId: user // or generate/guest
            });
            alert('Booking Confirmed!');
            clearSelection();
            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 409) {
                setBookingError('Some seats were just booked by another user. Please re-select.');
                // Refresh map
                api.get(`/shows/${id}/seats`).then(res => setSeats(res.data));
            } else {
                setBookingError('Booking failed. Please try again.');
            }
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (!show) return <div className="text-center p-10">Show not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded shadow mb-6">
                <h1 className="text-3xl font-bold mb-2">{show.title}</h1>
                <p>{show.description}</p>
                <div className="mt-2 text-indigo-600 font-bold">${show.price} per seat</div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <SeatMap seats={seats} />
                </div>
                <div className="w-full md:w-64 bg-white p-4 rounded shadow h-fit">
                    <h3 className="font-bold text-lg mb-4">Summary</h3>
                    <div className="flex justify-between mb-2">
                        <span>Selected:</span>
                        <span>{selectedSeats.length}</span>
                    </div>
                    <div className="flex justify-between mb-4 font-bold text-lg">
                        <span>Total:</span>
                        <span>${selectedSeats.length * show.price}</span>
                    </div>

                    {bookingError && (
                        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                            {bookingError}
                        </div>
                    )}

                    <button
                        onClick={handleBook}
                        disabled={selectedSeats.length === 0}
                        className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowDetails;
