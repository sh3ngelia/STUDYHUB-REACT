import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './DailyGoals.css';

export default function DailyGoals() {
  const [goals, setGoals] = useLocalStorage('studyhub_goals', []);
  const [completed, setCompleted] = useLocalStorage('studyhub_goals_done', []);
  const [input, setInput] = useState('');

  const doneSet = new Set(completed);
  const toggleGoal = (id) =>
    setCompleted((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const addGoal = () => {
    const text = input.trim();
    if (!text) return;
    setGoals((p) => [...p, { id: Date.now(), text }]);
    setInput('');
  };
  const clearAll = () => {
    if (window.confirm('ყველა მიზნის წაშლა?')) { setGoals([]); setCompleted([]); }
  };

  return (
    <div className="daily-goals">
      <h3>დღიური მიზნები</h3>
      <ul className="goals-list">
        {goals.length === 0 && <li className="goals-empty">მიზნები არ არის. დაამატე!</li>}
        {goals.map((g) => (
          <li key={g.id} className={`goal-item${doneSet.has(g.id) ? ' completed' : ''}`} onClick={() => toggleGoal(g.id)}>
            <span className="goal-check">{doneSet.has(g.id) ? '✓' : ''}</span>
            <span>{g.text}</span>
          </li>
        ))}
      </ul>
      <div className="goals-actions">
        <input
          className="goal-input" type="text" placeholder="ახალი მიზანი..."
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
        />
        <button className="goal-add-btn" onClick={addGoal} aria-label="დამატება"><Plus size={18} /></button>
        {goals.length > 0 && (
          <button className="goal-clear-btn" onClick={clearAll} aria-label="ყველა წაშლა"><Trash2 size={16} /></button>
        )}
      </div>
    </div>
  );
}
