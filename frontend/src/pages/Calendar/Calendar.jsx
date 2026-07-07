import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Star } from 'lucide-react';
import Card from '../../components/Card/Card';
import api from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import './Calendar.css';

const MONTHS = ['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი'];
const WEEKDAYS = ['ორ','სამ','ოთხ','ხუთ','პარ','შაბ','კვ'];

export default function Calendar() {
  const today = new Date();
  const { isAuthenticated } = useAuth();
  const [year, setYear] = useState(today.getFullYear());
  const [yearInput, setYearInput] = useState(String(today.getFullYear()));
  const [month, setMonth] = useState(today.getMonth());
  const [holidays, setHolidays] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [newEventText, setNewEventText] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/GE`);
        const data = await res.json();
        const map = {};
        data.forEach((h) => { map[h.date] = h.localName || h.name; });
        setHolidays(map);
      } catch {
        setHolidays({});
      }
    })();
  }, [year]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch {
        setEvents([]);
      }
    })();
  }, [isAuthenticated]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); setYearInput(String(year - 1)); } else setMonth((m) => m - 1); setSelectedDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); setYearInput(String(year + 1)); } else setMonth((m) => m + 1); setSelectedDay(null); };

  const startOffset = (() => { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; })();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const eventsForDay = (d) => events.filter((e) => e.date === dateKey(d));

  const addEvent = async (e) => {
    e.preventDefault();
    if (!newEventText.trim() || !selectedDay) return;
    try {
      const { data } = await api.post('/events', { date: dateKey(selectedDay), text: newEventText.trim() });
      setEvents((p) => [...p, data]);
      setNewEventText('');
    } catch {
      // შეცდომა/error
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents((p) => p.filter((e) => e.id !== id));
    } catch {
      // შეცდომა/error
    }
  };

  const selEvents = selectedDay ? eventsForDay(selectedDay) : [];
  const selHoliday = selectedDay ? holidays[dateKey(selectedDay)] : null;

  return (
    <div className="page">
      <h1>კალენდარი</h1>
      <div className="cal-layout">
        <Card className="cal-card">
          <div className="cal-header">
            <button className="cal-nav" onClick={prevMonth}><ChevronLeft size={18} /></button>
            <div className="cal-title">
              <span>{MONTHS[month]}</span>
              <div className="cal-year-nav">
                <button className="cal-nav" onClick={() => { setYear((y) => y - 1); setYearInput(String(year - 1)); setSelectedDay(null); }}>
                  <ChevronLeft size={14} />
                </button>
                <input
                  className="cal-year-input"
                  type="number"
                  value={yearInput}
                  onChange={(e) => {
                    setYearInput(e.target.value);
                    const v = Number(e.target.value);
                    if (v >= 1900 && v <= 2100) { setYear(v); setSelectedDay(null); }
                  }}
                />
                <button className="cal-nav" onClick={() => { setYear((y) => y + 1); setYearInput(String(year + 1)); setSelectedDay(null); }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <button className="cal-nav" onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>
          <div className="cal-weekdays">{WEEKDAYS.map((d) => <div key={d} className="cal-wd">{d}</div>)}</div>
          <div className="cal-days">
            {Array.from({ length: startOffset }, (_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1;
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isHoliday = !!holidays[dateKey(d)];
              const hasEvents = eventsForDay(d).length > 0;
              const isSelected = selectedDay === d;
              return (
                <motion.div
                  key={d}
                  className={`cal-day${isToday ? ' cal-today' : ''}${isHoliday ? ' cal-holiday' : ''}${isSelected ? ' cal-selected' : ''}`}
                  onClick={() => setSelectedDay(isSelected ? null : d)}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                >
                  {d}
                  {isHoliday && <span className="cal-hol-dot" title={holidays[dateKey(d)]}><Star size={10} fill="currentColor" strokeWidth={0} /></span>}
                  {hasEvents && <span className="cal-ev-dot" />}
                </motion.div>
              );
            })}
          </div>
        </Card>

        <div className="cal-side">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div key={selectedDay} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                <Card>
                  <h3 className="cal-detail-title">{selectedDay} {MONTHS[month]}, {year}</h3>
                  {selHoliday && <p className="cal-holiday-label">{selHoliday}</p>}
                  {selEvents.length > 0 ? (
                    <ul className="event-list">
                      {selEvents.map((ev) => (
                        <li key={ev.id} className="event-item">
                          <span>{ev.text}</span>
                          <button className="event-delete" onClick={() => deleteEvent(ev.id)}><X size={13} /></button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="cal-empty">ამ დღეს მოვლენები არ არის.</p>
                  )}
                  <form className="event-add-form" onSubmit={addEvent}>
                    <input type="text" placeholder="ახალი მოვლენა..." value={newEventText} onChange={(e) => setNewEventText(e.target.value)} />
                    <button type="submit" className="event-add-btn"><Plus size={16} /></button>
                  </form>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <h3>ყველა მოვლენა</h3>
                  {events.length > 0 ? (
                    <ul className="event-list">
                      {[...events].sort((a, b) => a.date.localeCompare(b.date)).map((ev) => (
                        <li key={ev.id} className="event-item">
                          <span className="event-date">{ev.date}</span>
                          <span className="event-text">{ev.text}</span>
                          <button className="event-delete" onClick={() => deleteEvent(ev.id)}><X size={13} /></button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="cal-empty">მოვლენები არ არის. დღეს დააჭირე.</p>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}