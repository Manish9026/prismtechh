import { Router } from 'express';
import subscribeRouter from './subscribe';
import uploadsRouter from './uploads';
import authRouter from './auth';
import servicesRouter from './services';
import projectsRouter from './projects';
import pricingRouter from './pricing';
import teamRouter from './team';
import messagesRouter from './messages';
import settingsRouter from './settings';
import adminRouter from './admin';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Prism Tech API v1' });
});

router.use('/subscribe', subscribeRouter);
router.use('/uploads', uploadsRouter);
router.use('/auth', authRouter);
router.use('/services', servicesRouter);
router.use('/projects', projectsRouter);
router.use('/pricing', pricingRouter);
router.use('/team', teamRouter);
router.use('/messages', messagesRouter);
router.use('/settings', settingsRouter);
router.use('/admin', adminRouter);

export default router;
