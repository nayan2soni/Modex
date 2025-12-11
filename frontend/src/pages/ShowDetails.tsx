import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Show, Seat } from '../types';
import SeatMap from '../components/SeatMap';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Check } from 'lucide-react';
import clsx from 'clsx';

const ShowDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [show, setShow] = useState<Show | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingError, setBookingError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { user } = useAuth();

    // BookingContext user was a dummy logic, we use AuthContext user now.
    const { selectedSeats, clearSelection } = useBooking();

    useEffect(() => {
        api.get('/shows').then(res => {
            const found = res.data.find((s: Show) => s._id === id);
            setShow(found);
        });

        api.get(`/shows/${id}/seats`)
            .then(res => setSeats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        const interval = setInterval(() => {
            api.get(`/shows/${id}/seats`).then(res => setSeats(res.data)).catch(() => { });
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    const handleBook = async () => {
        if (!user) {
            alert('Please login to book seats.');
            navigate('/login');
            return;
        }

        if (!show) return;
        setBookingError('');
        try {
            await api.post(`/shows/${id}/book`, {
                seatIds: selectedSeats,
                userId: user._id
            });
            setShowSuccessModal(true);
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 409) {
                setBookingError('Some seats were just booked by another user. Please re-select.');
                api.get(`/shows/${id}/seats`).then(res => setSeats(res.data));
            } else {
                setBookingError('Booking failed. Please try again.');
            }
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        clearSelection();
        navigate('/');
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (!show) return <div className="text-center p-10">Show not found</div>;

    const isSoldOut = seats.length > 0 && seats.every(s => s.status !== 'AVAILABLE');

    return (
        <div className="max-w-4xl mx-auto relative">
            <div className="bg-white p-6 rounded shadow mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{show.title}</h1>
                    <p>{show.description}</p>
                    <div className="mt-2 text-indigo-600 font-bold flex items-center gap-2">
                        ${show.price} per seat
                        {isSoldOut && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full uppercase tracking-wider">Sold Out</span>}
                    </div>
                </div>
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
                        disabled={selectedSeats.length === 0 || isSoldOut}
                        className={clsx(
                            "w-full py-3 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed",
                            isSoldOut ? "bg-gray-400 text-gray-200" : "bg-indigo-600 text-white hover:bg-indigo-700"
                        )}
                    >
                        {isSoldOut ? 'Sold Out' : 'Confirm Booking'}
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all scale-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={40} className="text-green-600" strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Booking Confirmed!</h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            Your ticket has been sent to your email.
                        </p>
                        <button
                            onClick={handleSuccessClose}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowDetails;
