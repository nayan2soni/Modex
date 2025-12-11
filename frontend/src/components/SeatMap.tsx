import clsx from 'clsx';
import { Seat } from '../types';
import { useBooking } from '../context/BookingContext';

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

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg overflow-x-auto">
            <div className="w-full bg-gray-300 h-8 rounded-t-lg mb-8 text-center text-gray-600 font-bold leading-8">SCREEN</div>

            <div className="grid gap-2">
                {rows.map(row => (
                    <div key={row} className="flex gap-2 items-center">
                        <span className="w-6 text-center font-bold text-gray-500">{row}</span>
                        {seats.filter(s => s.row === row).sort((a, b) => a.number - b.number).map(seat => {
                            const isSelected = selectedSeats.includes(seat._id);
                            const isAvailable = seat.status === 'AVAILABLE';

                            return (
                                <button
                                    key={seat._id}
                                    onClick={() => handleSeatClick(seat)}
                                    disabled={!isAvailable}
                                    className={clsx(
                                        "w-10 h-10 rounded transition-colors flex items-center justify-center text-xs font-semibold",
                                        !isAvailable && "bg-gray-400 cursor-not-allowed text-gray-200", // Booked
                                        isAvailable && !isSelected && "bg-white border hover:bg-indigo-100 text-gray-700", // Available
                                        isSelected && "bg-green-500 text-white shadow-md transform scale-105" // Selected
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

            <div className="flex gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border"></div> Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500"></div> Selected</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-400"></div> Booked</div>
            </div>
        </div>
    );
};

export default SeatMap;
