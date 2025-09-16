"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.post('/login', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isString().isLength({ min: 6 }), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email });
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ message: 'Invalid credentials' });
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});
// optional: bootstrap admin if none exists
router.post('/bootstrap-admin', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isString().isLength({ min: 6 }), async (req, res) => {
    const count = await User_1.User.countDocuments();
    if (count > 0)
        return res.status(400).json({ message: 'Admin already initialized' });
    const { email, password, name } = req.body;
    const hash = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.User.create({ email, passwordHash: hash, name, role: 'admin' });
    return res.json({ id: user.id, email: user.email });
});
exports.default = router;
//# sourceMappingURL=auth.js.map