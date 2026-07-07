import { motion } from 'framer-motion';
import './Card.css';

export default function Card({ children, className = '', style }) {
  return (
    <motion.div
      className={`card ${className}`}
      style={style}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  );
}
