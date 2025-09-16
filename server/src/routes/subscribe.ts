import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

const router = Router();

router.post(
  '/',
  body('email').isEmail().withMessage('Valid email required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body as { email: string };
    try {
      const host = process.env.SMTP_HOST;
      const port = Number(process.env.SMTP_PORT || 587);
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      if (!host || !user || !pass) {
        return res.status(500).json({ message: 'Email not configured' });
      }

      const transporter = nodemailer.createTransport({
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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Subscribe error', err);
      return res.status(500).json({ message: 'Failed to subscribe' });
    }
  }
);

export default router;


