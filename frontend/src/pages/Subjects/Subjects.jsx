import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpenCheck, LockKeyhole, Sparkles, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/client';
import { fetchStart, fetchSuccess, fetchFailure } from '../../store/subjectsSlice';
import SubjectCard from '../../components/SubjectCard/SubjectCard';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Button from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/page-banner.css';
import './Subjects.css';

export default function Subjects() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { items, status, error } = useSelector((s) => s.subjects);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    if (status !== 'idle') return;

    (async () => {
      dispatch(fetchStart());
      try {
        const { data } = await api.get('/subjects');
        console.log(data[0]);
        dispatch(fetchSuccess(data));
      } catch (err) {
        dispatch(fetchFailure(err.response?.data?.message || err.message));
      }
    })();
  }, [dispatch, isAuthenticated, status]);

  const total = items.length;
  const avg = total > 0 ? Math.round(items.reduce((s, i) => s + i.progress, 0) / total) : 0;
  const active = items.filter((i) => i.progress < 100).length;

  const filtered = items.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-banner">
        <h1>ჩემი საგნები</h1>
        <p>შეინახე შენი სასწავლო გეგმა, პროგრესი და ფოკუსი ერთ ადგილას.</p>
        {isAuthenticated && status === 'succeeded' && (
          <div className="stats-row">
            <div className="stat-badge"><span className="stat-badge_num">{total}</span><span className="stat-badge_label">საგანი</span></div>
            <div className="stat-badge"><span className="stat-badge_num">{avg}%</span><span className="stat-badge_label">საშ. პროგრესი</span></div>
            <div className="stat-badge"><span className="stat-badge_num">{active}</span><span className="stat-badge_label">აქტიური</span></div>
          </div>
        )}
      </div>

      <div className="subjects-header">
        <h2>ყველა საგანი</h2>
        {isAuthenticated && (
          <Link to="/add"><Button variant="primary">დამატება</Button></Link>
        )}
      </div>

      {isAuthenticated && status === 'succeeded' && items.length > 0 && (
        <div className="subjects-search">
          <Search size={16} className="subjects-search_icon" />
          <input
            type="text"
            placeholder="საგნის ძიება..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="subjects-search_input"
          />
        </div>
      )}

      {!isAuthenticated && (
        <motion.section
          className="subjects-locked"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="subjects-locked_icon" aria-hidden="true">
            <LockKeyhole size={34} />
          </div>
          <div className="subjects-locked_content">
            <span className="subjects-locked_eyebrow"><Sparkles size={16} /> პირადი სასწავლო სივრცე</span>
            <h3>შენი საგნები გელოდება.</h3>
            <p>შედი სისტემაში რომ გახსნა პირადი დაფა, პროგრესი და შენახული საგნები.</p>
            <div className="subjects-locked_actions">
              <Link to="/login" state={{ from: '/subjects' }}>
                <Button variant="primary">საგნების გახსნა</Button>
              </Link>
              <Link to="/">
                <Button variant="secondary">მთავარზე დაბრუნება</Button>
              </Link>
            </div>
          </div>
          <BookOpenCheck className="subjects-locked_mark" size={92} aria-hidden="true" />
        </motion.section>
      )}

      {isAuthenticated && status === 'loading' && <Loader label="საგნები იტვირთება..." />}
      {isAuthenticated && status === 'failed' && <ErrorMessage message={error} />}

      {isAuthenticated && status === 'succeeded' && (
        filtered.length > 0 ? (
          <motion.div
            className="subjects-grid"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {filtered.map((s) => <SubjectCard key={s.id} subject={s} />)}
          </motion.div>
        ) : (
          <div className="subjects-empty">
            {query ? (
              <p>"{query}" - ვერ მოიძებნა.</p>
            ) : (
              <>
                <p>საგნები არ არის. დაამატე პირველი და დაიწყე პროგრესის თვალყურის დევნება.</p>
                <Link to="/add"><Button variant="primary">პირველი საგნის დამატება</Button></Link>
              </>
            )}
          </div>
        )
      )}
    </div>
  );
}