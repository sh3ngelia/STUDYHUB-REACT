import { motion } from 'framer-motion';
import './Button.css';

export default function Button({ children, variant = 'primary', type = 'button', onClick, disabled = false, style, ...rest }) {
  return (
    <motion.button
      type={type}
      className={`btn btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
