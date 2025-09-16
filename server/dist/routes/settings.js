"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Settings_1 = require("../models/Settings");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const s = await Settings_1.Settings.findOne();
    res.json(s || {});
});
router.put('/', auth_1.requireAuth, async (req, res) => {
    const s = await Settings_1.Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(s);
});
exports.default = router;
//# sourceMappingURL=settings.js.map