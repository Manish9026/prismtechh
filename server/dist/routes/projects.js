"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Project_1 = require("../models/Project");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const items = await Project_1.Project.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
});
router.post('/', auth_1.requireAuth, (0, express_validator_1.body)('title').isString().notEmpty(), (0, express_validator_1.body)('description').isString().notEmpty(), (0, express_validator_1.body)('category').isIn(['Web App', 'CMS', 'Cybersecurity', 'Cloud']), (0, express_validator_1.body)('status').optional().isIn(['Draft', 'In Progress', 'Completed', 'Archived']), (0, express_validator_1.body)('featured').optional().isBoolean(), (0, express_validator_1.body)('clientName').optional().isString(), (0, express_validator_1.body)('clientEmail').optional().isEmail(), (0, express_validator_1.body)('timeline').optional().isString(), (0, express_validator_1.body)('startDate').optional().isISO8601(), (0, express_validator_1.body)('endDate').optional().isISO8601(), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const item = await Project_1.Project.create(req.body);
    res.status(201).json(item);
});
router.put('/:id', auth_1.requireAuth, async (req, res) => {
    const item = await Project_1.Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json(item);
});
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    const item = await Project_1.Project.findByIdAndDelete(req.params.id);
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
});
router.put('/reorder/bulk', auth_1.requireAuth, async (req, res) => {
    const list = req.body || [];
    const ops = list.map((x) => ({ updateOne: { filter: { _id: x.id }, update: { $set: { order: x.order } } } }));
    if (ops.length === 0)
        return res.json({ success: true });
    await Project_1.Project.bulkWrite(ops);
    res.json({ success: true });
});
// Bulk update featured status
router.put('/featured/bulk', auth_1.requireAuth, async (req, res) => {
    const { ids, featured } = req.body;
    if (!Array.isArray(ids) || typeof featured !== 'boolean') {
        return res.status(400).json({ message: 'Invalid request body' });
    }
    await Project_1.Project.updateMany({ _id: { $in: ids } }, { $set: { featured } });
    res.json({ success: true });
});
// Bulk update status
router.put('/status/bulk', auth_1.requireAuth, async (req, res) => {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !['Draft', 'In Progress', 'Completed', 'Archived'].includes(status)) {
        return res.status(400).json({ message: 'Invalid request body' });
    }
    await Project_1.Project.updateMany({ _id: { $in: ids } }, { $set: { status } });
    res.json({ success: true });
});
// Get featured projects for homepage
router.get('/featured', async (req, res) => {
    const items = await Project_1.Project.find({ featured: true }).sort({ order: 1, createdAt: -1 });
    res.json(items);
});
exports.default = router;
//# sourceMappingURL=projects.js.map