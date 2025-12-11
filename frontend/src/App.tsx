import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowList from './pages/ShowList';
import ShowDetails from './pages/ShowDetails';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <AuthProvider>
                <BookingProvider>
                    <div className="min-h-screen bg-gray-50 text-gray-900">
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <Routes>
                                <Route path="/" element={<ShowList />} />
                                <Route path="/booking/:id" element={<ShowDetails />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                    </div>
                </BookingProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
