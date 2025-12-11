import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Show } from '../types';
import { Calendar, MapPin, Ticket } from 'lucide-react';

const ShowList = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/shows')
            .then(res => setShows(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center p-10 text-gray-500">Loading amazing shows...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Upcoming Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {shows.map(show => (
                    <div key={show._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                            <Ticket size={48} className="opacity-50" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 line-clamp-1" title={show.title}>{show.title}</h2>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                                        Movie
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-bold text-gray-900">${show.price}</span>
                                    <span className="text-xs text-gray-500">per seat</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm mb-6 line-clamp-2">{show.description || 'No description available for this event.'}</p>

                            <div className="mt-auto space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar size={16} className="mr-2 text-indigo-500" />
                                    <span>{new Date(show.startTime).toLocaleDateString()} at {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin size={16} className="mr-2 text-indigo-500" />
                                    <span>{show.venueHall}</span>
                                </div>
                                {show.availableSeats !== undefined && show.availableSeats === 0 && (
                                    <div className="flex items-center text-sm text-red-600 font-bold">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                        Sold Out
                                    </div>
                                )}
                            </div>

                            {show.availableSeats === 0 ? (
                                <button
                                    disabled
                                    className="mt-6 block w-full text-center bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                                >
                                    Sold Out
                                </button>
                            ) : (
                                <Link
                                    to={`/booking/${show._id}`}
                                    className="mt-6 block w-full text-center bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
                                >
                                    Book Seats
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {shows.length === 0 && (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                    <div className="text-gray-400 mb-2">No shows found</div>
                    <p className="text-gray-500">Check back later for new events!</p>
                </div>
            )}
        </div>
    );
};

export default ShowList;
