import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Show } from '../types';

const ShowList = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/shows')
            .then(res => setShows(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center p-10">Loading shows...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map(show => (
                <div key={show._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <h2 className="text-2xl font-bold mb-2">{show.title}</h2>
                    <p className="text-gray-600 mb-4">{show.description || 'No description'}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>{new Date(show.startTime).toLocaleString()}</span>
                        <span>{show.venueHall}</span>
                    </div>
                    <Link
                        to={`/booking/${show._id}`}
                        className="block text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-medium"
                    >
                        Book Seats
                    </Link>
                </div>
            ))}
            {shows.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                    No shows available. Check back later or create one in Admin.
                </div>
            )}
        </div>
    );
};

export default ShowList;
