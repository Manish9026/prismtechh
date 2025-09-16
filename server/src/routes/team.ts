import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { TeamMember } from '../models/TeamMember';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await TeamMember.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post('/', requireAuth, body('name').notEmpty(), body('role').notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const item = await TeamMember.create(req.body);
  res.status(201).json(item);
});

router.put('/:id', requireAuth, async (req, res) => {
  const item = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const item = await TeamMember.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
});

// Reorder endpoint: accept array of {id, order}
router.put('/reorder/bulk', requireAuth, async (req, res) => {
  const list: Array<{ id: string; order: number }> = req.body || [];
  const ops = list.map((x) => ({ updateOne: { filter: { _id: x.id }, update: { $set: { order: x.order } } } }));
  if (ops.length === 0) return res.json({ success: true });
  await TeamMember.bulkWrite(ops);
  res.json({ success: true });
});

export default router;


