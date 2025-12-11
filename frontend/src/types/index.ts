export interface Show {
    _id: string;
    title: string;
    description?: string;
    startTime: string;
    venueHall: string;
    totalSeats: number;
    price: number;
}

export interface Seat {
    _id: string;
    showId: string;
    row: string;
    number: number;
    status: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
}
