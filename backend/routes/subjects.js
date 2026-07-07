import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Subject from '../models/Subject.js';

const router = Router();

const clampProgress = (value) => {
  const progress = Number(value);
  if (Number.isNaN(progress)) return 0;
  return Math.min(100, Math.max(0, progress));
};

router.get('/', authMiddleware, async (req, res) => {
  const subjects = await Subject.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(subjects);
});

router.get('/:id', authMiddleware, async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, owner: req.user.id });
  if (!subject) return res.status(404).json({ message: 'საგანი ვერ მოიძებნა' });
  res.json(subject);
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, color, progress } = req.body || {};
  if (!title || !description) return res.status(400).json({ message: 'სახელი და აღწერა სავალდებულოა' });

  const subject = await Subject.create({
    owner: req.user.id,
    title: title.trim(),
    description: description.trim(),
    color: color || '#6c5ce7',
    progress: clampProgress(progress),
  });
  res.status(201).json(subject);
});

router.patch('/:id', authMiddleware, async (req, res) => {
  const { progress, title, description } = req.body || {};
  const update = {};
  if (progress !== undefined) update.progress = clampProgress(progress);
  if (title !== undefined) update.title = title.trim();
  if (description !== undefined) update.description = description.trim();

  const subject = await Subject.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    update,
    { new: true }
  );
  if (!subject) return res.status(404).json({ message: 'საგანი ვერ მოიძებნა' });
  res.json(subject);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const subject = await Subject.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!subject) return res.status(404).json({ message: 'საგანი ვერ მოიძებნა' });
  res.status(204).end();
});

export default router;