import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Event from '../models/Event.js';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  const events = await Event.find({ owner: req.user.id });
  res.json(events);
});

router.post('/', authMiddleware, async (req, res) => {
  const { date, text } = req.body || {};
  if (!date || !text) return res.status(400).json({ message: 'date და text სავალდებულოა' });

  const event = await Event.create({ owner: req.user.id, date, text });
  res.status(201).json(event);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const event = await Event.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!event) return res.status(404).json({ message: 'მოვლენა ვერ მოიძებნა' });
  res.status(204).end();
});

export default router;