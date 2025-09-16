import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  }
);

// optional: bootstrap admin if none exists
router.post(
  '/bootstrap-admin',
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  async (req, res) => {
    const count = await User.countDocuments();
    if (count > 0) return res.status(400).json({ message: 'Admin already initialized' });
    const { email, password, name } = req.body as { email: string; password: string; name?: string };
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash: hash, name, role: 'admin' });
    return res.json({ id: user.id, email: user.email });
  }
);

export default router;


