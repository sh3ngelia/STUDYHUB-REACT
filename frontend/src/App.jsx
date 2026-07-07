import { Routes, Route, useLocation } from 'react-router-dom';
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
              <li><a href="/subjects">ჩემი საგნები</a></li>
              <li><a href="/calendar">კალენდარი</a></li>
              <li><a href="/add">საგნის დამატება</a></li>
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
