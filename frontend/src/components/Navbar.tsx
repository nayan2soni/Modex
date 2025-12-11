import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow p-4 mb-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600">Modex Shows</Link>
                <nav className="space-x-4 flex items-center">
                    <Link to="/" className="hover:text-indigo-600 font-medium">Events</Link>
                    {user ? (
                        <>
                            <span className="text-gray-600">Hi, {user.name}</span>
                            <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-indigo-600 font-medium">Login</Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-medium">Register</Link>
                        </>
                    )}
                    <Link to="/admin" className="text-gray-400 hover:text-gray-600 text-sm">Admin</Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
