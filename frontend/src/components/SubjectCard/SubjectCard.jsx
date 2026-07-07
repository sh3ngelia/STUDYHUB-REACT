import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import api from '../../api/client';
import { removeSubject } from '../../store/subjectsSlice';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../StatusBadge/StatusBadge';
import Card from '../Card/Card';
import '../../styles/progress.css';
import './SubjectCard.css';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function SubjectCard({ subject }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    try {
      await api.delete(`/subjects/${subject.id}`);
      dispatch(removeSubject(subject.id));
    } catch {
      setDeleting(false);
      setConfirm(false);
    }
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="subject-card">
        <div className="subject-card_top-bar" style={{ background: subject.color }} />
        <h3 className="subject-card_title">{subject.title}</h3>
        <p className="subject-card_desc">{subject.description}</p>

        {subject.progress > 0 ? (
          <div className="progress">
            <div className="progress_track">
              <div
                className="progress_fill"
                style={{ width: `${subject.progress}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}cc)` }}
              />
            </div>
            <span className="subject-card_pct">{subject.progress}%</span>
          </div>
        ) : (
          <p className="subject-card_empty">პროგრესი ჯერ არ არის დაფიქსირებული</p>
        )}

        <div className="subject-card_footer">
          <StatusBadge progress={subject.progress} />
          <div className="subject-card_actions">
            {isAuthenticated && (
              <button
                className={`delete-btn${confirm ? ' confirm' : ''}`}
                onClick={handleDelete}
                disabled={deleting}
                onBlur={() => setTimeout(() => setConfirm(false), 200)}
                title={confirm ? 'დარწმუნებული ხარ?' : 'წაშლა'}
              >
                {deleting ? '...' : confirm ? 'წაშლა?' : <Trash2 size={14} />}
              </button>
            )}
            <Link to={`/subjects/${subject.id}`} className="subject-card_link">დეტალი</Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
