"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Message_1 = require("../models/Message");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, async (req, res) => {
    const { start, end, status, page = '1', pageSize = '50' } = req.query;
    const query = {};
    if (status && (status === 'read' || status === 'unread'))
        query.status = status;
    if (start || end) {
        query.createdAt = {};
        if (start)
            query.createdAt.$gte = new Date(start);
        if (end)
            query.createdAt.$lte = new Date(end);
    }
    const p = Math.max(1, parseInt(page, 10) || 1);
    const ps = Math.min(200, Math.max(1, parseInt(pageSize, 10) || 50));
    const [items, total] = await Promise.all([
        Message_1.Message.find(query).sort({ createdAt: -1 }).skip((p - 1) * ps).limit(ps),
        Message_1.Message.countDocuments(query)
    ]);
    res.json({ items, total, page: p, pageSize: ps });
});
router.post('/', (0, express_validator_1.body)('name').notEmpty(), (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('message').notEmpty(), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const item = await Message_1.Message.create(req.body);
    res.status(201).json(item);
});
router.put('/:id/read', auth_1.requireAuth, async (req, res) => {
    const item = await Message_1.Message.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json(item);
});
// Bulk mark read/unread
router.put('/bulk/status', auth_1.requireAuth, async (req, res) => {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !ids.length || (status !== 'read' && status !== 'unread'))
        return res.status(400).json({ message: 'Invalid payload' });
    const result = await Message_1.Message.updateMany({ _id: { $in: ids } }, { $set: { status } });
    res.json({ success: true, modified: result.modifiedCount });
});
// Bulk delete
router.delete('/bulk', auth_1.requireAuth, async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length)
        return res.status(400).json({ message: 'Invalid payload' });
    const result = await Message_1.Message.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deleted: result.deletedCount });
});
exports.default = router;
//# sourceMappingURL=messages.js.map