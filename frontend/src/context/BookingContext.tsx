import { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
    selectedSeats: string[]; // Set of Seat IDs
    selectSeat: (seatId: string) => void;
    deselectSeat: (seatId: string) => void;
    clearSelection: () => void;
    user: string | null; // Simple User ID
    setUser: (id: string | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [user, setUser] = useState<string | null>(null);

    const selectSeat = (seatId: string) => {
        setSelectedSeats(prev => [...prev, seatId]);
    };

    const deselectSeat = (seatId: string) => {
        setSelectedSeats(prev => prev.filter(id => id !== seatId));
    };

    const clearSelection = () => setSelectedSeats([]);

    return (
        <BookingContext.Provider value={{ selectedSeats, selectSeat, deselectSeat, clearSelection, user, setUser }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within BookingProvider');
    return context;
};
