import { motion } from 'framer-motion';
import { BookOpen, Bell, BarChart2, Timer } from 'lucide-react';
import Card from '../Card/Card';
import './FeatureCards.css';

const FEATURES = [
  { Icon: BookOpen, title: 'საგნების მართვა',  desc: 'დაამატე, ჩაასწორე ან წაშალე საგნები შენი გრაფიკის შესაბამისად.' },
  { Icon: Bell,     title: 'შეხსენებები',       desc: 'არ გამოგრჩეს ვადები - StudyHub შეგახსენებს ყველა მნიშვნელოვან თარიღს.' },
  { Icon: BarChart2,title: 'სტატისტიკა',        desc: 'დააკვირდი შენს პროგრესს ვიზუალურად და გაიგე სად გჭირდება გაუმჯობესება.' },
  { Icon: Timer,    title: 'სწავლის ტაიმერი',  desc: 'Pomodoro ტაიმერი - 25 წუთი სწავლა, 5 წუთი შესვენება.' },
];

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function FeatureCards() {
  return (
    <motion.div className="features-grid" initial="hidden" animate="visible" variants={stagger}>
      {FEATURES.map(({ Icon, title, desc }) => (
        <motion.div key={title} variants={item}>
          <Card className="feature-card">
            <div className="feature-icon"><Icon size={28} strokeWidth={1.8} /></div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
