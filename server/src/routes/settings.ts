import { Router } from 'express';
import { Settings } from '../models/Settings';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const s = await Settings.findOne();
  res.json(s || {});
});

router.put('/', requireAuth, async (req, res) => {
  const s = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json(s);
});

export default router;


