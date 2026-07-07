import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import '../../styles/progress.css';
import './ProgressOverview.css';

export default function ProgressOverview() {
  const subjects = useSelector((s) => s.subjects.items);
  const total = subjects.length;
  const done = subjects.filter((s) => s.progress === 100).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="progress-overview">
      <h3>პროგრესის მიმოხილვა</h3>
      <div className="progress_track progress_track--lg">
        <motion.div
          className="progress_fill"
          style={{ background: 'var(--gradient-blue)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <p className="progress-pct">
        პროგრესი: <strong>{pct}%</strong>
      </p>
      <div className="progress-stats">
        <span><span className="stat-label">დასრულებული:</span> <strong>{done}</strong></span>
        <span><span className="stat-label">სულ:</span> <strong>{total}</strong></span>
      </div>
    </div>
  );
}
