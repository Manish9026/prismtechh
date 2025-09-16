import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Project } from '../models/Project';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post(
  '/',
  requireAuth,
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('category').isIn(['Web App','CMS','Cybersecurity','Cloud']),
  body('status').optional().isIn(['Draft', 'In Progress', 'Completed', 'Archived']),
  body('featured').optional().isBoolean(),
  body('clientName').optional().isString(),
  body('clientEmail').optional().isEmail(),
  body('timeline').optional().isString(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const item = await Project.create(req.body);
    res.status(201).json(item);
  }
);

router.put('/:id', requireAuth, async (req, res) => {
  const item = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
});

router.put('/reorder/bulk', requireAuth, async (req, res) => {
  const list: Array<{ id: string; order: number }> = req.body || [];
  const ops = list.map((x) => ({ updateOne: { filter: { _id: x.id }, update: { $set: { order: x.order } } } }));
  if (ops.length === 0) return res.json({ success: true });
  await Project.bulkWrite(ops);
  res.json({ success: true });
});

// Bulk update featured status
router.put('/featured/bulk', requireAuth, async (req, res) => {
  const { ids, featured } = req.body;
  if (!Array.isArray(ids) || typeof featured !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request body' });
  }
  await Project.updateMany({ _id: { $in: ids } }, { $set: { featured } });
  res.json({ success: true });
});

// Bulk update status
router.put('/status/bulk', requireAuth, async (req, res) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || !['Draft', 'In Progress', 'Completed', 'Archived'].includes(status)) {
    return res.status(400).json({ message: 'Invalid request body' });
  }
  await Project.updateMany({ _id: { $in: ids } }, { $set: { status } });
  res.json({ success: true });
});

// Get featured projects for homepage
router.get('/featured', async (req, res) => {
  const items = await Project.find({ featured: true }).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

export default router;


