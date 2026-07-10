import { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home/Home';
import Subjects from './pages/Subjects/Subjects';
import SubjectDetail from './pages/SubjectDetail/SubjectDetail';
import AddSubject from './pages/AddSubject/AddSubject';
import Calendar from './pages/Calendar/Calendar';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';
import './styles/footer.css';

export default function App() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <Navbar />
      {isHome ? (
        <Routes><Route path="/" element={<Home />} /></Routes>
      ) : (
        <main>
          <Routes>
            <Route path="/subjects"     element={<Subjects />} />
            <Route path="/subjects/:id" element={<SubjectDetail />} />
            <Route path="/calendar"     element={<Calendar />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/add"          element={<ProtectedRoute><AddSubject /></ProtectedRoute>} />
            <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*"             element={<NotFound />} />
          </Routes>
        </main>
      )}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>StudyHub</h4>
            <p>შენი სასწავლო პროცესის საუკეთესო მენეჯერი.</p>
          </div>
          <div className="footer-section">
            <h4>სწრაფი ბმულები</h4>
            <ul className="footer-links">
              <li><Link to="/subjects">ჩემი საგნები</Link></li>
              <li><Link to="/calendar">კალენდარი</Link></li>
              <li><Link to="/add">საგნის დამატება</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <p>© {new Date().getFullYear()} StudyHub. ყველა უფლება დაცულია.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
