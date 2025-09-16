"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const TeamMember_1 = require("../models/TeamMember");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const items = await TeamMember_1.TeamMember.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
});
router.post('/', auth_1.requireAuth, (0, express_validator_1.body)('name').notEmpty(), (0, express_validator_1.body)('role').notEmpty(), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const item = await TeamMember_1.TeamMember.create(req.body);
    res.status(201).json(item);
});
router.put('/:id', auth_1.requireAuth, async (req, res) => {
    const item = await TeamMember_1.TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json(item);
});
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    const item = await TeamMember_1.TeamMember.findByIdAndDelete(req.params.id);
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
});
// Reorder endpoint: accept array of {id, order}
router.put('/reorder/bulk', auth_1.requireAuth, async (req, res) => {
    const list = req.body || [];
    const ops = list.map((x) => ({ updateOne: { filter: { _id: x.id }, update: { $set: { order: x.order } } } }));
    if (ops.length === 0)
        return res.json({ success: true });
    await TeamMember_1.TeamMember.bulkWrite(ops);
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=team.js.map