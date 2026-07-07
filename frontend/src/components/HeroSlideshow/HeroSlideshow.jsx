import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import './HeroSlideshow.css';

const SLIDES = ['/study1.jpg', '/study2.jpg', '/study3.jpg', '/study4.jpg'];

export default function HeroSlideshow() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hero-slideshow">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="hero-slide"
          style={{ backgroundImage: `url(${SLIDES[idx]})` }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="slide-overlay" />
        </motion.div>
      </AnimatePresence>
      <div className="hero-content">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          მართე შენი სასწავლო პროცესი ერთ სივრცეში
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          StudyHub გეხმარება საგნების, დავალებებისა და კალენდრის ორგანიზებაში.
        </motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Link to="/subjects"><Button variant="primary">ჩემი საგნები</Button></Link>
          <Link to="/add"><Button variant="secondary">საგნის დამატება</Button></Link>
        </motion.div>
      </div>
      <div className="slide-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`slide-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  );
}
