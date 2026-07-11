import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import '../../styles/page-banner.css';
import '../../styles/forms.css';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login');
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { login, register: registerUser, authError, setAuthError } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const switchMode = (m) => { setMode(m); reset(); setAuthError(null); setShowPassword(false); setShowConfirm(false); };

  const onSubmit = async (vals) => {
    setSubmitting(true);
    const ok = mode === 'login'
      ? await login(vals.username, vals.password)
      : await registerUser(vals.username, vals.password, vals.name);
    setSubmitting(false);
    if (ok) navigate(location.state?.from || '/subjects');
  };

  const pwVal = watch('password', '');

  return (
    <div className="page page--narrow">
      <div className="page-banner">
        <h1>{mode === 'login' ? 'შესვლა' : 'რეგისტრაცია'}</h1>
        <p>{mode === 'login' ? 'StudyHub-ში შესასვლელად შეიყვანე მონაცემები' : 'შექმენი ახალი ანგარიში'}</p>
      </div>

      <div className="auth-tabs">
        <button className={`auth-tab${mode === 'login' ? ' active' : ''}`} onClick={() => switchMode('login')}>შესვლა</button>
        <button className={`auth-tab${mode === 'register' ? ' active' : ''}`} onClick={() => switchMode('register')}>რეგისტრაცია</button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {mode === 'register' && (
                <div className="form-field">
                  <label htmlFor="name">სახელი</label>
                  <input id="name" type="text" placeholder="შენი სახელი"
                    {...register('name', { required: 'სახელი სავალდებულოა', minLength: { value: 2, message: 'მინ. 2 სიმბოლო' } })} />
                  {errors.name && <span className="field-error">{errors.name.message}</span>}
                </div>
              )}

              <div className="form-field">
                <label htmlFor="username">მომხმარებლის სახელი</label>
                <input id="username" type="text" placeholder="username"
                  {...register('username', {
                    required: 'სავალდებულო',
                    minLength: { value: 3, message: 'მინ. 3 სიმბოლო' },
                    pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'მხოლოდ ლათინური ასოები, ციფრები, _' },
                  })} />
                {errors.username && <span className="field-error">{errors.username.message}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="password">პაროლი</label>
                <div className="input-eye">
                  <input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••"
                    {...register('password', {
                      required: 'სავალდებულო',
                      validate: (v) => {
                        if (mode === 'login') return true;
                        if (v.length < 8) return 'მინ. 8 სიმბოლო';
                        if (!/[A-Z]/.test(v)) return 'მინიმუმ ერთი დიდი ასო';
                        if (!/[a-z]/.test(v)) return 'მინიმუმ ერთი პატარა ასო';
                        if (!/[0-9]/.test(v)) return 'მინიმუმ ერთი ციფრი';
                        return true;
                      },
                    })} />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="field-error">{errors.password.message}</span>}
              </div>

              {mode === 'register' && (
                <div className="form-field">
                  <label htmlFor="confirm">პაროლის დადასტურება</label>
                  <div className="input-eye">
                    <input id="confirm" type={showConfirm ? 'text' : 'password'} placeholder="••••••"
                      {...register('confirm', {
                        required: 'სავალდებულო',
                        validate: (v) => v === pwVal || 'პაროლები არ ემთხვევა',
                      })} />
                    <button type="button" className="eye-btn" onClick={() => setShowConfirm((v) => !v)}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirm && <span className="field-error">{errors.confirm.message}</span>}
                </div>
              )}

              {authError && <div className="auth-error">{authError}</div>}

              <Button type="submit" variant="primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                {submitting ? 'გთხოვთ დაიცადოთ...' : mode === 'login' ? 'შესვლა' : 'რეგისტრაცია'}
              </Button>
            </form>

            <p className="auth-switch">
              {mode === 'login' ? 'ანგარიში არ გაქვს? ' : 'უკვე გაქვს ანგარიში? '}
              <button className="link-btn" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'დარეგისტრირდი' : 'შედი'}
              </button>
            </p>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}