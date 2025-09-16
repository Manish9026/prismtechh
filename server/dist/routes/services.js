"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Service_1 = require("../models/Service");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const items = await Service_1.Service.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
});
router.post('/', auth_1.requireAuth, (0, express_validator_1.body)('title').isString().notEmpty(), (0, express_validator_1.body)('description').isString().notEmpty(), (0, express_validator_1.body)('featured').optional().isBoolean(), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const item = await Service_1.Service.create(req.body);
    res.status(201).json(item);
});
router.put('/:id', auth_1.requireAuth, (0, express_validator_1.body)('title').optional().isString(), (0, express_validator_1.body)('description').optional().isString(), async (req, res) => {
    const item = await Service_1.Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json(item);
});
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    const item = await Service_1.Service.findByIdAndDelete(req.params.id);
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
});
// Bulk reorder
router.put('/reorder/bulk', auth_1.requireAuth, async (req, res) => {
    const updates = Array.isArray(req.body) ? req.body : [];
    const ops = updates.map((u) => ({
        updateOne: { filter: { _id: u.id }, update: { $set: { order: u.order } } }
    }));
    if (ops.length === 0)
        return res.json({ success: true, updated: 0 });
    const result = await Service_1.Service.bulkWrite(ops);
    res.json({ success: true, updated: result.modifiedCount ?? 0 });
});
// Bulk update featured status
router.put('/featured/bulk', auth_1.requireAuth, async (req, res) => {
    const { ids, featured } = req.body;
    if (!Array.isArray(ids) || typeof featured !== 'boolean') {
        return res.status(400).json({ message: 'Invalid request body' });
    }
    await Service_1.Service.updateMany({ _id: { $in: ids } }, { $set: { featured } });
    res.json({ success: true });
});
// Get featured services for homepage
router.get('/featured', async (req, res) => {
    const items = await Service_1.Service.find({ featured: true }).sort({ order: 1, createdAt: -1 });
    res.json(items);
});
exports.default = router;
//# sourceMappingURL=services.js.map