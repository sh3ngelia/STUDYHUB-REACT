import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Button/Button';
import './Navbar.css';
import { usernameToColor } from '../../utils/colors';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/', label: 'მთავარი', end: true },
    { to: '/subjects', label: 'ჩემი საგნები' },
    { to: '/add', label: 'დამატება' },
    { to: '/calendar', label: 'კალენდარი' },
  ];

  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="logo">StudyHub</NavLink>

        <nav className="nav-links-desktop">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="თემის შეცვლა">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {isAuthenticated ? (
            <>
              <button
                className="avatar-btn"
                onClick={() => navigate('/profile')}
                title={user.name}
                style={{ background: usernameToColor(user.username) }}
              >
                {user.name?.[0]?.toUpperCase()}
              </button>
              <Button variant="secondary" onClick={handleLogout}>გასვლა</Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => navigate('/login')}>შესვლა</Button>
          )}
          <button
            className={`burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="მენიუ"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} color="white" /> : <Menu size={20} color="white" />}
          </button>
        </div>
      </header>

      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}

      <nav className={`nav-drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="nav-drawer_header">
          <span className="logo" style={{ color: 'white' }}>StudyHub</span>
          <button className="drawer-close" onClick={() => setMenuOpen(false)}>
            <X size={18} color="white" />
          </button>
        </div>
        <ul className="nav-drawer_links">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end}>{l.label}</NavLink>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <NavLink to="/profile">პროფილი</NavLink>
            </li>
          )}
        </ul>
        <div className="nav-drawer_footer">
          {isAuthenticated ? (
            <>
              <p className="drawer-user">{user.name}</p>
              <button className="drawer-btn" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                სისტემიდან გასვლა
              </button>
            </>
          ) : (
            <button className="drawer-btn" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
              შესვლა
            </button>
          )}
          <button className="drawer-theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? 'ღამის რეჟიმი' : 'დღის რეჟიმი'}
          </button>
        </div>
      </nav>
    </>
  );
}