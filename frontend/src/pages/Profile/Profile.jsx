import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import '../../styles/page-banner.css';
import '../../styles/forms.css';
import './Profile.css';

const TABS = [
  { id: 'info',     label: 'ინფო' },
  { id: 'password', label: 'პაროლი' },
  { id: 'delete',   label: 'წაშლა' },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('info');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');

  const nameForm = useForm({ defaultValues: { name: user?.name || '' } });
  const pwForm = useForm();

  const onUpdateName = async ({ name }) => {
    setLoading(true); setMsg(null);
    try {
      await api.patch('/auth/me', { name });
      const stored = JSON.parse(localStorage.getItem('studyhub_user') || '{}');
      localStorage.setItem('studyhub_user', JSON.stringify({ ...stored, name }));
      setMsg({ type: 'ok', text: 'სახელი განახლდა! გთხოვთ შეხვიდეთ ხელახლა.' });
      setTimeout(() => { logout(); navigate('/login'); }, 2000);
    } catch (e) {
      setMsg({ type: 'err', text: e.response?.data?.message || 'შეცდომა' });
    } finally { setLoading(false); }
  };

  const onChangePassword = async ({ currentPassword, newPassword }) => {
    setLoading(true); setMsg(null);
    try {
      await api.patch('/auth/me/password', { currentPassword, newPassword });
      setMsg({ type: 'ok', text: 'პაროლი წარმატებით შეიცვალა!' });
      pwForm.reset();
    } catch (e) {
      setMsg({ type: 'err', text: e.response?.data?.message || 'შეცდომა' });
    } finally { setLoading(false); }
  };

  const onDelete = async () => {
    if (confirmDelete !== user?.username) { setMsg({ type: 'err', text: 'მომხმარებლის სახელი არასწორია' }); return; }
    setLoading(true); setMsg(null);
    try {
      await api.delete('/auth/me');
      logout();
      navigate('/');
    } catch (e) {
      setMsg({ type: 'err', text: e.response?.data?.message || 'წაშლა ვერ მოხერხდა' });
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-banner">
        <div className="profile-avatar">{user?.name?.[0]?.toUpperCase() || '?'}</div>
        <h1>{user?.name}</h1>
        <p>@{user?.username}</p>
      </div>

      <div className="profile-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`profile-tab${tab === t.id ? ' active' : ''}`} onClick={() => { setTab(t.id); setMsg(null); }}>
            {t.label}
          </button>
        ))}
      </div>

      {msg && (
        <motion.div className={`profile-msg profile-msg--${msg.type}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          {msg.text}
        </motion.div>
      )}

      <Card className="form-card">
        {tab === 'info' && (
          <form onSubmit={nameForm.handleSubmit(onUpdateName)} noValidate>
            <div className="form-field">
              <label>მომხმარებლის სახელი</label>
              <input type="text" value={user?.username || ''} disabled className="input-disabled" />
              <span className="hint">მომხმარებლის სახელი არ იცვლება</span>
            </div>
            <div className="form-field">
              <label>სახელი</label>
              <input type="text" {...nameForm.register('name', { required: 'სახელი სავალდებულოა', minLength: { value: 2, message: 'მინ. 2 სიმბოლო' } })} />
              {nameForm.formState.errors.name && <span className="field-error">{nameForm.formState.errors.name.message}</span>}
            </div>
            <div className="form-actions">
              <Button type="submit" variant="primary" disabled={loading}>{loading ? 'ინახება...' : 'შენახვა'}</Button>
            </div>
          </form>
        )}

        {tab === 'password' && (
          <form onSubmit={pwForm.handleSubmit(onChangePassword)} noValidate>
            <div className="form-field">
              <label>მიმდინარე პაროლი</label>
              <input type="password" placeholder="••••••" {...pwForm.register('currentPassword', { required: 'სავალდებულო' })} />
              {pwForm.formState.errors.currentPassword && <span className="field-error">{pwForm.formState.errors.currentPassword.message}</span>}
            </div>
            <div className="form-field">
              <label>ახალი პაროლი</label>
              <input type="password" placeholder="••••••" {...pwForm.register('newPassword', {
                  required: 'სავალდებულო',
                  validate: (v) => {
                    if (v.length < 8) return 'მინ. 8 სიმბოლო';
                    if (!/[A-Z]/.test(v)) return 'მინიმუმ ერთი დიდი ასო';
                    if (!/[a-z]/.test(v)) return 'მინიმუმ ერთი პატარა ასო';
                    if (!/[0-9]/.test(v)) return 'მინიმუმ ერთი ციფრი';
                    return true;
                  },
                })} />
              {pwForm.formState.errors.newPassword && <span className="field-error">{pwForm.formState.errors.newPassword.message}</span>}
            </div>
            <div className="form-field">
              <label>გაიმეორე ახალი პაროლი</label>
              <input type="password" placeholder="••••••"
                {...pwForm.register('confirmPassword', { required: 'სავალდებულო', validate: (v) => v === pwForm.watch('newPassword') || 'პაროლები არ ემთხვევა' })} />
              {pwForm.formState.errors.confirmPassword && <span className="field-error">{pwForm.formState.errors.confirmPassword.message}</span>}
            </div>
            <div className="form-actions">
              <Button type="submit" variant="primary" disabled={loading}>{loading ? 'იცვლება...' : 'პაროლის შეცვლა'}</Button>
            </div>
          </form>
        )}

        {tab === 'delete' && (
          <div>
            <div className="delete-warning">
              <p><strong>ეს მოქმედება შეუქცევადია!</strong></p>
              <p>ანგარიშის წაშლით გაქრება ყველა შენი მონაცემი. დასადასტურებლად ჩაწერე შენი მომხმარებლის სახელი:</p>
              <code className="username-code">{user?.username}</code>
            </div>
            <div className="form-field" style={{ marginTop: '1rem' }}>
              <label>მომხმარებლის სახელი</label>
              <input type="text" placeholder={user?.username} value={confirmDelete}
                onChange={(e) => { setConfirmDelete(e.target.value); setMsg(null); }} />
            </div>
            <Button variant="danger" onClick={onDelete} disabled={loading || !confirmDelete} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'იშლება...' : 'ანგარიშის სამუდამოდ წაშლა'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
