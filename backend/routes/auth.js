import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Event from '../models/Event.js';

const router = Router();
const strongPassword = (p) => p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p);

const signToken = (user) =>
  jwt.sign({ id: user._id, username: user.username, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

const safeUser = (u) => ({ id: u._id, username: u.username, name: u.name });

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'ყველა ველი სავალდებულოა' });

  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'მომხმარებლის სახელი ან პაროლი არასწორია' });
  }
  res.json({ token: signToken(user), user: safeUser(user) });
});

router.post('/register', async (req, res) => {
  const { username, password, name } = req.body || {};
  if (!username || !password || !name) return res.status(400).json({ message: 'ყველა ველი სავალდებულოა' });
  if (!strongPassword(password)) return res.status(400).json({ message: 'პაროლი: მინ. 8 სიმბოლო, დიდი/პატარა ასო, ციფრი' });

  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ message: 'მომხმარებლის სახელი უკვე დაკავებულია' });

  const user = await User.create({ username, password, name });
  res.status(201).json({ token: signToken(user), user: safeUser(user) });
});

router.patch('/me', authMiddleware, async (req, res) => {
  const { name } = req.body || {};
  if (!name || name.trim().length < 2) return res.status(400).json({ message: 'სახელი მინ. 2 სიმბოლო' });

  const user = await User.findByIdAndUpdate(req.user.id, { name: name.trim() }, { new: true });
  if (!user) return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
  res.json(safeUser(user));
});

router.patch('/me/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'მიმდინარე პაროლი არასწორია' });
  }
  if (!newPassword || !strongPassword(newPassword)) return res.status(400).json({ message: 'პაროლი: მინ. 8 სიმბოლო, დიდი/პატარა ასო, ციფრი' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'პაროლი შეიცვალა' });
});

router.delete('/me', authMiddleware, async (req, res) => {
  await Subject.deleteMany({ owner: req.user.id });
  await Event.deleteMany({ owner: req.user.id });
  await User.findByIdAndDelete(req.user.id);
  res.status(204).end();
});

export default router;