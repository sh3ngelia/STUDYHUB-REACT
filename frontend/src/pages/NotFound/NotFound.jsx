import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/Button/Button';
import './NotFound.css';

export default function NotFound() {
  return (
    <motion.div className="notfound" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="notfound_code">404</h1>
      <h2 className="notfound_title">გვერდი ვერ მოიძებნა</h2>
      <p className="notfound_desc">მოთხოვნილი გვერდი არ არსებობს ან წაიშალა.</p>
      <Link to="/"><Button variant="primary">მთავარზე დაბრუნება</Button></Link>
    </motion.div>
  );
}