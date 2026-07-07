import { useState, useEffect } from 'react';
import { Wind, Compass, RefreshCw, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudSun } from 'lucide-react';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './WeatherWidget.css';

const LAT = 41.7151;
const LON = 44.8271;

const WMO = {
  0:  { label: 'მზიანი',         Icon: Sun },
  1:  { label: 'თითქმის მზიანი', Icon: CloudSun },
  2:  { label: 'ცვალებადი',      Icon: CloudSun },
  3:  { label: 'მოღრუბლული',    Icon: Cloud },
  45: { label: 'ნისლი',          Icon: CloudFog },
  61: { label: 'წვიმა',          Icon: CloudRain },
  63: { label: 'ძლიერი წვიმა',  Icon: CloudRain },
  71: { label: 'თოვლი',         Icon: CloudSnow },
  95: { label: 'ჭექა-ქუხილი',  Icon: CloudLightning },
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`,
          { signal: ctrl.signal }
        );
        if (!res.ok) throw new Error('სერვისი მიუწვდომელია');
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  if (loading) return <Loader label="ამინდი იტვირთება..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!weather) return null;

  const cond = WMO[weather.weathercode] || { label: 'ამინდი', Icon: Sun };
  const { Icon: WeatherIcon } = cond;
  const time = new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="weather-widget">
      <h3>თბილისი</h3>
      <div className="weather-main">
        <span className="weather-temp">{Math.round(weather.temperature)}°C</span>
        <WeatherIcon size={40} strokeWidth={1.5} className="weather-icon" />
      </div>
      <p className="weather-label">{cond.label}</p>
      <div className="weather-details">
        <span className="weather-detail"><Wind size={14} /> {weather.windspeed} კმ/სთ</span>
        <span className="weather-detail"><Compass size={14} /> {weather.winddirection}°</span>
        <span className="weather-detail"><RefreshCw size={14} /> {time}</span>
      </div>
    </div>
  );
}