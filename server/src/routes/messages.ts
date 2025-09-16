import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Message } from '../models/Message';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const { start, end, status, page = '1', pageSize = '50' } = req.query as Record<string,string>
  const query: any = {}
  if (status && (status === 'read' || status === 'unread')) query.status = status
  if (start || end) {
    query.createdAt = {}
    if (start) query.createdAt.$gte = new Date(start)
    if (end) query.createdAt.$lte = new Date(end)
  }
  const p = Math.max(1, parseInt(page, 10) || 1)
  const ps = Math.min(200, Math.max(1, parseInt(pageSize, 10) || 50))
  const [items, total] = await Promise.all([
    Message.find(query).sort({ createdAt: -1 }).skip((p-1)*ps).limit(ps),
    Message.countDocuments(query)
  ])
  res.json({ items, total, page: p, pageSize: ps })
});

router.post('/', body('name').notEmpty(), body('email').isEmail(), body('message').notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const item = await Message.create(req.body);
  res.status(201).json(item);
});

router.put('/:id/read', requireAuth, async (req, res) => {
  const item = await Message.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// Bulk mark read/unread
router.put('/bulk/status', requireAuth, async (req, res) => {
  const { ids, status } = req.body as { ids: string[]; status: 'read'|'unread' }
  if (!Array.isArray(ids) || !ids.length || (status !== 'read' && status !== 'unread')) return res.status(400).json({ message: 'Invalid payload' })
  const result = await Message.updateMany({ _id: { $in: ids } }, { $set: { status } })
  res.json({ success: true, modified: result.modifiedCount })
})

// Bulk delete
router.delete('/bulk', requireAuth, async (req, res) => {
  const { ids } = req.body as { ids: string[] }
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'Invalid payload' })
  const result = await Message.deleteMany({ _id: { $in: ids } })
  res.json({ success: true, deleted: result.deletedCount })
})

export default router;


