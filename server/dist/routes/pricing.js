"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const PricingTier_1 = require("../models/PricingTier");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const items = await PricingTier_1.PricingTier.find().sort({ order: 1, price: 1 });
    res.json(items);
});
router.post('/', auth_1.requireAuth, (0, express_validator_1.body)('name').isString().notEmpty(), (0, express_validator_1.body)('price').isNumeric(), (0, express_validator_1.body)('currency').optional().isString(), (0, express_validator_1.body)('billingPeriod').optional().isIn(['monthly', 'yearly', 'one-time', 'custom']), (0, express_validator_1.body)('features').optional().isArray(), (0, express_validator_1.body)('popular').optional().isBoolean(), (0, express_validator_1.body)('featured').optional().isBoolean(), (0, express_validator_1.body)('color').optional().isString(), (0, express_validator_1.body)('icon').optional().isString(), (0, express_validator_1.body)('buttonText').optional().isString(), (0, express_validator_1.body)('buttonLink').optional().isString(), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const item = await PricingTier_1.PricingTier.create(req.body);
    res.status(201).json(item);
});
router.put('/:id', auth_1.requireAuth, async (req, res) => {
    const item = await PricingTier_1.PricingTier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json(item);
});
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    const item = await PricingTier_1.PricingTier.findByIdAndDelete(req.params.id);
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
});
// Bulk reorder
router.put('/reorder/bulk', auth_1.requireAuth, async (req, res) => {
    const list = req.body || [];
    const ops = list.map((x) => ({ updateOne: { filter: { _id: x.id }, update: { $set: { order: x.order } } } }));
    if (ops.length === 0)
        return res.json({ success: true });
    await PricingTier_1.PricingTier.bulkWrite(ops);
    res.json({ success: true });
});
// Get featured pricing tiers
router.get('/featured', async (req, res) => {
    const items = await PricingTier_1.PricingTier.find({ featured: true }).sort({ order: 1, price: 1 });
    res.json(items);
});
exports.default = router;
//# sourceMappingURL=pricing.js.map