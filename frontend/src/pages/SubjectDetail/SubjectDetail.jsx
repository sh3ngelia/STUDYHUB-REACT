import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { ChevronLeft, Save, Pencil, X } from 'lucide-react';
import api from '../../api/client';
import { updateSubjectProgress, updateSubject } from '../../store/subjectsSlice';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import '../../styles/page-banner.css';
import '../../styles/progress.css';
import '../../styles/forms.css';
import './SubjectDetail.css';

const COLORS = [
  '#6c5ce7', '#0984e3', '#00b894', '#e17055',
  '#fdcb6e', '#e84393', '#00cec9', '#a29bfe',
];

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localProgress, setLocalProgress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/subjects/${id}`);
        setSubject(data);
      } catch (err) {
        setError(err.response?.data?.message || 'შეცდომა');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader label="საგნის ინფორმაცია იტვირთება..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!subject) return null;

  const progress = localProgress !== null ? localProgress : subject.progress;

  const saveProgress = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      await api.patch(`/subjects/${subject._id}`, { progress });
      dispatch(updateSubjectProgress({ id: subject._id, progress }));
      setSubject({ ...subject, progress });
      setSaveMsg('შენახულია!');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch {
      setSaveMsg('შენახვა ვერ მოხერხდა');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = () => {
    setEditTitle(subject.title);
    setEditDesc(subject.description);
    setEditColor(subject.color);
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || !editDesc.trim()) return;
    setEditSaving(true);
    try {
      await api.patch(`/subjects/${subject._id}`, { title: editTitle.trim(), description: editDesc.trim(), color: editColor });
      setSubject({ ...subject, title: editTitle.trim(), description: editDesc.trim(), color: editColor });
      dispatch(updateSubject({ id: subject._id, title: editTitle.trim(), description: editDesc.trim(), color: editColor }));
      setEditing(false);
    } catch {
      // შეცდომა
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="page">
      <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        <ChevronLeft size={16} /> უკან
      </Button>

      <div className="page-banner">
        <h1>{subject.title}</h1>
        <p>{subject.description}</p>
      </div>

      {isAuthenticated && !editing && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.8rem' }}>
          <Button variant="secondary" onClick={startEdit}>
            <Pencil size={15} /> რედაქტირება
          </Button>
        </div>
      )}

      {editing && (
        <Card style={{ marginBottom: '1rem' }}>
          <div className="form-field">
            <label>საგნის სახელი</label>
            <input
              type="text"
              value={editTitle}
              maxLength={50}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>აღწერა</label>
            <textarea
              rows={3}
              value={editDesc}
              maxLength={300}
              onChange={(e) => setEditDesc(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>ფერი</label>
            <div className="color-picker">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`color-swatch${editColor === c ? ' active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setEditColor(c)}
                  type="button"
                />
              ))}
            </div>
          </div>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setEditing(false)}>
              <X size={15} /> გაუქმება
            </Button>
            <Button variant="primary" onClick={saveEdit} disabled={editSaving || !editTitle.trim() || !editDesc.trim()}>
              <Save size={15} /> {editSaving ? 'ინახება...' : 'შენახვა'}
            </Button>
          </div>
        </Card>
      )}

      <Card className="detail-card">
        <div className="detail-bar" style={{ background: `linear-gradient(90deg, ${subject.color}, ${subject.color}99)` }} />

        <div className="detail-progress">
          <div className="detail-progress_label">
            <strong>პროგრესი</strong>
            <span className="detail-progress_value">{progress}%</span>
          </div>
          <div className="progress_track detail-progress_track">
            <motion.div
              className="progress_fill"
              style={{ background: `linear-gradient(90deg, ${subject.color}, ${subject.color}cc)` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>

          {isAuthenticated && (
            <div className="detail-progress_controls">
              <input
                type="range" min={0} max={100} value={progress}
                onChange={(e) => { setLocalProgress(Number(e.target.value)); setSaveMsg(''); }}
                className="progress-slider"
              />
              <div className="detail-save-row">
                <Button
                  variant="primary"
                  onClick={saveProgress}
                  disabled={saving || localProgress === null || localProgress === subject.progress}
                >
                  <Save size={15} /> {saving ? 'ინახება...' : 'შენახვა'}
                </Button>
                {saveMsg && <span className="save-msg">{saveMsg}</span>}
              </div>
            </div>
          )}
        </div>

        <div className="detail-footer">
          <StatusBadge progress={progress} />
          {!isAuthenticated && (
            <p className="detail-auth-hint">
              პროგრესის შესაცვლელად <a href="/login">შედი</a> ანგარიშში.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}