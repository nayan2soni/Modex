import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowList from './pages/ShowList';
import ShowDetails from './pages/ShowDetails';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <header className="bg-white shadow p-4 mb-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <h1 className="text-xl font-bold text-indigo-600">Modex Shows</h1>
                        <nav className="space-x-4">
                            <a href="/" className="hover:text-indigo-600">Events</a>
                            <a href="/admin" className="hover:text-indigo-600">Admin</a>
                        </nav>
                    </div>
                </header>

                <main className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<ShowList />} />
                        <Route path="/booking/:id" element={<ShowDetails />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
