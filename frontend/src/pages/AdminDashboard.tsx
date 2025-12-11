import { useState } from 'react';
import api from '../api/client';

const AdminDashboard = () => {
    // Basic implementation for now
    const [title, setTitle] = useState('');
    const [venueHall, setVenueHall] = useState('');
    const [price, setPrice] = useState(100);
    const [msg, setMsg] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/shows', {
                title,
                venueHall,
                price,
                totalSeats: 50,
                startTime: new Date().toISOString(),
                description: 'Created via Admin Dashboard'
            });
            setMsg('Show created successfully!');
        } catch (err) {
            setMsg('Error creating show');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Create Show</h2>
            <form onSubmit={handleCreate} className="space-y-4">
                <div>
                    <label>Title</label>
                    <input className="border w-full p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Venue</label>
                    <input className="border w-full p-2 rounded" value={venueHall} onChange={e => setVenueHall(e.target.value)} required />
                </div>
                <div>
                    <label>Price</label>
                    <input type="number" className="border w-full p-2 rounded" value={price} onChange={e => setPrice(Number(e.target.value))} required />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Create</button>
            </form>
            {msg && <p className="mt-4 text-center">{msg}</p>}
        </div>
    );
};
export default AdminDashboard;
