import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import subjectRoutes from './routes/subjects.js';
import eventRoutes from './routes/events.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/events', eventRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'სერვერის შეცდომა' });
});

connectDB()
  .then(() => app.listen(PORT, () => console.log(`StudyHub API → http://localhost:${PORT}`)))
  .catch((err) => { console.error('DB connection failed:', err); process.exit(1); });