import { useNavigate } from 'react-router-dom';
import { Plus, List, Calendar, Timer } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './QuickActions.css';

export default function QuickActions({ onTimerOpen }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const links = [
    { Icon: Plus,     label: 'საგნის დამატება', action: () => navigate('/add') },
    { Icon: List,     label: 'ყველა საგანი',     action: () => navigate('/subjects') },
    { Icon: Calendar, label: 'კალენდარი',         action: () => navigate('/calendar') },
    { Icon: Timer,    label: 'ტაიმერი',           action: onTimerOpen },
  ];

  return (
    <div className="quick-actions">
      <h3>სწრაფი მოქმედებები</h3>
      <div className="quick-actions-grid">
        {links.map(({ Icon, label, action }) => (
          <button key={label} className="quick-action-btn" onClick={action}>
            <Icon size={24} className="qa-icon" strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
