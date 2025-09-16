"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = (0, express_1.Router)();
router.post('/', (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT || 587);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        if (!host || !user || !pass) {
            return res.status(500).json({ message: 'Email not configured' });
        }
        const transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
        await transporter.sendMail({
            from: `Prism Tech <${user}>`,
            to: user,
            subject: 'New newsletter subscriber',
            text: `New subscriber: ${email}`,
            html: `<p>New subscriber: <strong>${email}</strong></p>`,
        });
        return res.json({ success: true });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('Subscribe error', err);
        return res.status(500).json({ message: 'Failed to subscribe' });
    }
});
exports.default = router;
//# sourceMappingURL=subscribe.js.map