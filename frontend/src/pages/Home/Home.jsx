import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import HeroSlideshow from '../../components/HeroSlideshow/HeroSlideshow';
import FeatureCards from '../../components/FeatureCards/FeatureCards';
import DailyGoals from '../../components/DailyGoals/DailyGoals';
import ProgressOverview from '../../components/ProgressOverview/ProgressOverview';
import QuickActions from '../../components/QuickActions/QuickActions';
import QuoteBanner from '../../components/QuoteBanner/QuoteBanner';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';
import ContactForm from '../../components/ContactForm/ContactForm';
import StudyTimer from '../../components/StudyTimer/StudyTimer';
import Card from '../../components/Card/Card';
import './Home.css';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div className="home-page">
      <HeroSlideshow />

      <div className="home-content">
        {isAuthenticated && (
          <motion.div className="welcome-strip" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            გამარჯობა, <strong>{user.name}</strong>! კარგი სასწავლო დღე გქონდეს.
          </motion.div>
        )}

        <FeatureCards />

        <section className="dashboard-grid">
          <Card><DailyGoals /></Card>
          <Card><ProgressOverview /></Card>
          <Card><QuickActions onTimerOpen={() => setShowTimer(true)} /></Card>
        </section>

        <QuoteBanner />

        <Card className="weather-card"><WeatherWidget /></Card>

        <Card className="contact-card"><ContactForm /></Card>
      </div>

      {showTimer && <StudyTimer onClose={() => setShowTimer(false)} />}
    </div>
  );
}
