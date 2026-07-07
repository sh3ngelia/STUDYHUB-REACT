import './StatusBadge.css';

const STATUS_MAP = {
  done:    { label: 'დასრულებული', className: 'badge--done' },
  active:  { label: 'მიმდინარე',   className: 'badge--active' },
  pending: { label: 'დაუწყებელი', className: 'badge--pending' },
};

export function getStatus(progress) {
  if (progress === 100) return 'done';
  if (progress > 0) return 'active';
  return 'pending';
}

export default function StatusBadge({ progress }) {
  const key = getStatus(progress);
  const { label, className } = STATUS_MAP[key];
  return <span className={`status-badge ${className}`}>{label}</span>;
}
