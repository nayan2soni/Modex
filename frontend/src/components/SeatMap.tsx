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

    // Drag/Paint Selection Logic
    const isDragging = useRef(false);
    const isTouchMode = useRef(false); // To distinguish touch from mouse
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Standard Toggle Logic (Click)
    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'BOOKED' || seat.status === 'LOCKED') return;

        if (selectedSeats.includes(seat._id)) {
            deselectSeat(seat._id);
        } else {
            selectSeat(seat._id);
        }
    };

    // Helper: Select seat if available
    const handleSeatInteraction = (seat: Seat) => {
        if (seat.status !== 'AVAILABLE') return;
        // Paint only selects (additive). 
        if (!selectedSeats.includes(seat._id)) {
            selectSeat(seat._id);
        }
    };

    // PC: Mouse Down -> Start Drag
    const handleMouseDown = (seat: Seat) => {
        if (isTouchMode.current) return;
        isDragging.current = true;
        handleSeatInteraction(seat);
    };

    // PC: Mouse Enter -> Paint if dragging
    const handleMouseEnter = (seat: Seat) => {
        if (isDragging.current) {
            handleSeatInteraction(seat);
        }
    };

    // PC: Mouse Up -> Stop Drag
    const handleMouseUp = () => {
        isDragging.current = false;
    };

    // Mobile: Touch Logic
    const handleTouchStart = (e: React.TouchEvent) => {
        isTouchMode.current = true;
        const target = e.target as HTMLElement;
        const seatId = target.getAttribute('data-id');

        // Start Long Press Timer
        longPressTimer.current = setTimeout(() => {
            isDragging.current = true; // Enable "Drag Mode"
            if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback

            // Select the initial seat that started the press
            if (seatId) {
                const seat = seats.find(s => s._id === seatId);
                if (seat) handleSeatInteraction(seat);
            }
        }, 500);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) {
            // If moving before long press trigger, cancel timer (it's a scroll)
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
            }
            return;
        }

        // If dragging active, prevent scroll and select seat under finger
        if (e.cancelable) e.preventDefault();

        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        if (element) {
            const seatId = element.getAttribute('data-id');
            if (seatId) {
                const seat = seats.find(s => s._id === seatId);
                if (seat) handleSeatInteraction(seat);
            }
        }
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        isDragging.current = false;
        // Don't reset isTouchMode immediately to prevent phantom mouse events
        setTimeout(() => isTouchMode.current = false, 500);
    };

    return (
        <div
            className="w-full overflow-x-auto pb-8"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="min-w-max flex flex-col items-center gap-6 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm mx-auto">
                {/* Cinema Screen Visual */}
                <div className="w-3/4 max-w-lg mb-8 relative group">
                    <div className="h-4 bg-gray-300 rounded-t-lg shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] transform -skew-x-6"></div>
                    <div className="absolute top-6 left-0 right-0 text-center text-xs tracking-[0.3em] text-gray-400 font-semibold">SCREEN</div>
                    <div className="h-12 w-full bg-gradient-to-b from-indigo-50/50 to-transparent absolute top-4 left-0 right-0 blur-xl"></div>
                </div>

                <div className="grid gap-3 select-none touch-none">
                    {rows.map(row => (
                        <div key={row} className="flex gap-3 items-center">
                            <span className="w-6 text-center font-bold text-gray-400 text-sm">{row}</span>
                            {seats.filter(s => s.row === row).sort((a, b) => a.number - b.number).map(seat => {
                                const isSelected = selectedSeats.includes(seat._id);
                                const isAvailable = seat.status === 'AVAILABLE';

                                return (
                                    <button
                                        key={seat._id}
                                        data-id={seat._id}
                                        onMouseDown={() => handleMouseDown(seat)}
                                        onMouseEnter={() => handleMouseEnter(seat)}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                        onClick={() => {
                                            // Handle standard click toggle only if not dragging
                                            if (!isDragging.current && !isTouchMode.current) {
                                                handleSeatClick(seat);
                                            }
                                        }}
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
