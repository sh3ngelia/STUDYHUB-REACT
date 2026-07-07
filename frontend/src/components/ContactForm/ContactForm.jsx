import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button/Button';
import '../../styles/forms.css';
import './ContactForm.css';

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [msg, setMsg] = useState('');

  const onSubmit = () => {
    setMsg('შეტყობინება წარმატებით გაიგზავნა!');
    reset();
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="contact-form">
      <h3>დაგვიკავშირდი</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-field">
          <label>სახელი</label>
          <input type="text" placeholder="შენი სახელი"
            {...register('name', { required: 'სავალდებულო' })} />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </div>
        <div className="form-field">
          <label>ელ. ფოსტა</label>
          <input type="email" placeholder="example@mail.com"
            {...register('email', {
              required: 'სავალდებულო',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'სწორი ელ. ფოსტა შეიყვანე' },
            })} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </div>
        <div className="form-field">
          <label>შეტყობინება</label>
          <textarea rows={4} placeholder="შეტყობინება..."
            {...register('message', { required: 'სავალდებულო' })} />
          {errors.message && <span className="field-error">{errors.message.message}</span>}
        </div>
        <div className="form-field checkbox-field">
          <input type="checkbox" id="agree-c"
            {...register('agree', { required: 'წესებს უნდა დაეთანხმო' })} />
          <label htmlFor="agree-c">ვეთანხმები წესებს</label>
          {errors.agree && <span className="field-error">{errors.agree.message}</span>}
        </div>
        <Button type="submit" variant="primary">გაგზავნა</Button>
        {msg && <p className="form-success-msg">{msg}</p>}
      </form>
    </div>
  );
}
