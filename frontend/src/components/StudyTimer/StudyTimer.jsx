import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import './StudyTimer.css';

export default function StudyTimer({ onClose }) {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const start = () => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setTimeout(() => alert('სესია დასრულდა! შესვენების დროა.'), 100);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };
  const pause = () => { setRunning(false); clearInterval(intervalRef.current); };
  const reset = () => { pause(); setTimeLeft(duration * 60); };
  const changeDuration = (v) => {
    const d = Math.max(1, Math.min(120, Number(v)));
    setDuration(d);
    if (!running) setTimeLeft(d * 60);
  };

  const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal-box" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="modal-header">
          <h3>სწავლის ტაიმერი</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="timer-display">{m}:{s}</div>
        <div className="timer-controls">
          <button className="timer-btn timer-btn--primary" onClick={start} disabled={running}>დაწყება</button>
          <button className="timer-btn timer-btn--secondary" onClick={pause} disabled={!running}>პაუზა</button>
          <button className="timer-btn" onClick={reset}>ხელახლა</button>
        </div>
        <div className="timer-settings">
          <label htmlFor="t-dur">ხანგრძლივობა (წთ):</label>
          <input id="t-dur" type="number" min={1} max={120} value={duration}
            onChange={(e) => changeDuration(e.target.value)} />
        </div>
      </motion.div>
    </div>
  );
}
