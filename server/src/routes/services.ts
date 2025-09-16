import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Service } from '../models/Service';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await Service.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post(
  '/',
  requireAuth,
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('featured').optional().isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const item = await Service.create(req.body);
    res.status(201).json(item);
  }
);

router.put(
  '/:id',
  requireAuth,
  body('title').optional().isString(),
  body('description').optional().isString(),
  async (req, res) => {
    const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  }
);

router.delete('/:id', requireAuth, async (req, res) => {
  const item = await Service.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
});

// Bulk reorder
router.put('/reorder/bulk', requireAuth, async (req, res) => {
  const updates = Array.isArray(req.body) ? req.body : [];
  const ops = updates.map((u: { id: string; order: number }) => ({
    updateOne: { filter: { _id: u.id }, update: { $set: { order: u.order } } }
  }));
  if (ops.length === 0) return res.json({ success: true, updated: 0 });
  const result = await Service.bulkWrite(ops);
  res.json({ success: true, updated: result.modifiedCount ?? 0 });
});

// Bulk update featured status
router.put('/featured/bulk', requireAuth, async (req, res) => {
  const { ids, featured } = req.body;
  if (!Array.isArray(ids) || typeof featured !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request body' });
  }
  await Service.updateMany({ _id: { $in: ids } }, { $set: { featured } });
  res.json({ success: true });
});

// Get featured services for homepage
router.get('/featured', async (req, res) => {
  const items = await Service.find({ featured: true }).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

export default router;


