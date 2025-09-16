import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PricingTier } from '../models/PricingTier';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await PricingTier.find().sort({ order: 1, price: 1 });
  res.json(items);
});

router.post('/', 
  requireAuth, 
  body('name').isString().notEmpty(),
  body('price').isNumeric(),
  body('currency').optional().isString(),
  body('billingPeriod').optional().isIn(['monthly', 'yearly', 'one-time', 'custom']),
  body('features').optional().isArray(),
  body('popular').optional().isBoolean(),
  body('featured').optional().isBoolean(),
  body('color').optional().isString(),
  body('icon').optional().isString(),
  body('buttonText').optional().isString(),
  body('buttonLink').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const item = await PricingTier.create(req.body);
    res.status(201).json(item);
  }
);

router.put('/:id', requireAuth, async (req, res) => {
  const item = await PricingTier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const item = await PricingTier.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
});

// Bulk reorder
router.put('/reorder/bulk', requireAuth, async (req, res) => {
  const list: Array<{ id: string; order: number }> = req.body || [];
  const ops = list.map((x) => ({ updateOne: { filter: { _id: x.id }, update: { $set: { order: x.order } } } }));
  if (ops.length === 0) return res.json({ success: true });
  await PricingTier.bulkWrite(ops);
  res.json({ success: true });
});

// Get featured pricing tiers
router.get('/featured', async (req, res) => {
  const items = await PricingTier.find({ featured: true }).sort({ order: 1, price: 1 });
  res.json(items);
});

export default router;


