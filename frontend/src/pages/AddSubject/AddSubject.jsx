import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, FileText, Trophy } from 'lucide-react';
import api from '../../api/client';
import { addSubject } from '../../store/subjectsSlice';
import { pickRandomColor } from '../../utils/colors';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import '../../styles/page-banner.css';
import '../../styles/forms.css';
import './AddSubject.css';

const TIPS = [
  { Icon: BookOpen, title: 'მიზანი',         desc: 'კონკრეტული მიზანი დაუსახე თავს.' },
  { Icon: Clock,    title: 'განრიგი',         desc: 'ყოველ დღე გარკვეული დრო გამოყავი.' },
  { Icon: FileText, title: 'ჩანაწერები',      desc: 'კარგი ჩანაწერები = კარგი შედეგი.' },
  { Icon: Trophy,   title: 'კონსისტენტობა',  desc: 'ყოველდღიური 30 წუთი ჯობია კვირაში ერთ გრძელ სესიას.' },
];

export default function AddSubject() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const titleVal = watch('title', '');
  const descVal = watch('description', '');

  const onSubmit = async (vals) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const { data } = await api.post('/subjects', { ...vals, color: pickRandomColor(), progress: 0 });
      dispatch(addSubject(data));
      reset();
      navigate('/subjects');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'საგნის დამატება ვერ მოხერხდა');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-banner">
        <h1>ახალი საგნის დამატება</h1>
        <p>შეავსე ინფორმაცია ახალი სასწავლო საგნის შესახებ</p>
      </div>

      <div className="tips-grid">
        {TIPS.map(({ Icon, title, desc }) => (
          <motion.div key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="tip-card">
              <Icon size={26} className="tip-icon" strokeWidth={1.8} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="form-card">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-field">
            <label htmlFor="title">
              საგნის სახელი
              <span className="char-count">{titleVal.length}/50</span>
            </label>
            <input
              id="title" type="text" maxLength={50} placeholder="მაგ. მათემატიკა"
              {...register('title', {
                required: 'სახელის ველი სავალდებულოა',
                minLength: { value: 2, message: 'მინიმუმ 2 სიმბოლო' },
                pattern: { value: /^[A-Za-zა-ჰ0-9\s'-]+$/, message: 'გამოიყენეთ მხოლოდ ასოები და ციფრები' },
              })}
            />
            {errors.title && <span className="field-error">{errors.title.message}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="description">
              აღწერა
              <span className="char-count">{descVal.length}/300</span>
            </label>
            <textarea
              id="description" rows={4} maxLength={300} placeholder="მოკლე აღწერა..."
              {...register('description', {
                required: 'აღწერის ველი სავალდებულოა',
                minLength: { value: 10, message: 'მინიმუმ 10 სიმბოლო' },
              })}
            />
            {errors.description && <span className="field-error">{errors.description.message}</span>}
          </div>

          {submitError && <p className="field-error">{submitError}</p>}

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>გაუქმება</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'ემატება...' : 'დამატება'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
