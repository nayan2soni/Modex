import clsx from 'clsx';
import { Seat } from '../types';
import { useBooking } from '../context/BookingContext';
import { useRef } from 'react';

interface SeatMapProps {
    seats: Seat[];
}

const SeatMap = ({ seats }: SeatMapProps) => {
    const { selectedSeats, selectSeat, deselectSeat } = useBooking();

    // Group seats by Row
    const rows = [...new Set(seats.map(s => s.row))];

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'BOOKED' || seat.status === 'LOCKED') return;

        if (selectedSeats.includes(seat._id)) {
            deselectSeat(seat._id);
        } else {
            selectSeat(seat._id);
        }
    };

    const handleBatchSelect = (startSeat: Seat) => {
        if (startSeat.status !== 'AVAILABLE') return;

        // Find seats in the same row
        const rowSeats = seats.filter(s => s.row === startSeat.row).sort((a, b) => a.number - b.number);
        const startIndex = rowSeats.findIndex(s => s._id === startSeat._id);

        // Select current + next 2 available seats (Total 3)
        const candidates = rowSeats.slice(startIndex, startIndex + 3);
        const availableCandidates = candidates.filter(s => s.status === 'AVAILABLE');

        availableCandidates.forEach(s => {
            if (!selectedSeats.includes(s._id)) {
                selectSeat(s._id);
            }
        });
    };

    // Long Press Logic for Mobile
    let pressTimer: NodeJS.Timeout;

    const handleTouchStart = (seat: Seat) => {
        pressTimer = setTimeout(() => {
            handleBatchSelect(seat);
            // Optional: Vibrate on mobile for feedback
            if (navigator.vibrate) navigator.vibrate(50);
        }, 600); // 600ms for long press
    };

    const handleTouchEnd = () => {
        clearTimeout(pressTimer);
    };

    return (
        <div className="w-full overflow-x-auto pb-8">
            <div className="min-w-max flex flex-col items-center gap-6 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm mx-auto">
                {/* Cinema Screen Visual */}
                <div className="w-3/4 max-w-lg mb-8 relative group">
                    <div className="h-4 bg-gray-300 rounded-t-lg shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] transform -skew-x-6"></div>
                    <div className="absolute top-6 left-0 right-0 text-center text-xs tracking-[0.3em] text-gray-400 font-semibold">SCREEN</div>
                    <div className="h-12 w-full bg-gradient-to-b from-indigo-50/50 to-transparent absolute top-4 left-0 right-0 blur-xl"></div>
                </div>

                <div className="grid gap-3 select-none">
                    {rows.map(row => (
                        <div key={row} className="flex gap-3 items-center">
                            <span className="w-6 text-center font-bold text-gray-400 text-sm">{row}</span>
                            {seats.filter(s => s.row === row).sort((a, b) => a.number - b.number).map(seat => {
                                const isSelected = selectedSeats.includes(seat._id);
                                const isAvailable = seat.status === 'AVAILABLE';

                                return (
                                    <button
                                        key={seat._id}
                                        onClick={() => handleSeatClick(seat)}
                                        onDoubleClick={() => handleBatchSelect(seat)}
                                        onTouchStart={() => handleTouchStart(seat)}
                                        onTouchEnd={handleTouchEnd}
                                        disabled={!isAvailable}
                                        className={clsx(
                                            "w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 ease-out",
                                            "border",
                                            !isAvailable && "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed",
                                            isAvailable && !isSelected && "bg-white border-gray-300 text-gray-600 hover:border-indigo-400 hover:shadow-indigo-100 hover:scale-110 hover:z-10",
                                            isSelected && "bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 scale-105 ring-2 ring-indigo-200 ring-offset-1"
                                        )}
                                        title={`Row ${seat.row} Seat ${seat.number}`}
                                    >
                                        {seat.number}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-gray-100 text-sm w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-white border border-gray-300"></div>
                        <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-indigo-600 border border-indigo-600 shadow-sm"></div>
                        <span className="text-gray-900 font-medium">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gray-100 border border-gray-200"></div>
                        <span className="text-gray-400">Booked</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
