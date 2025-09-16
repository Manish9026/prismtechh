import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import type { PipelineStage } from 'mongoose';
import { Service } from '../models/Service';
import { Project } from '../models/Project';
import { PricingTier } from '../models/PricingTier';
import { Message } from '../models/Message';

const router = Router();

// Basic stats for dashboard
router.get('/stats', requireAuth, async (_req, res) => {
  const [services, projects, pricing, messages] = await Promise.all([
    Service.countDocuments(),
    Project.countDocuments(),
    PricingTier.countDocuments(),
    Message.countDocuments(),
  ]);

  // naive recent activity: latest 5 messages and 5 projects/services updates
  const recentMsgs = await Message.find().sort({ updatedAt: -1 }).limit(5).select('email status updatedAt createdAt');
  const recentProjects = await Project.find().sort({ updatedAt: -1 }).limit(5).select('title updatedAt createdAt');
  const recentServices = await Service.find().sort({ updatedAt: -1 }).limit(5).select('title updatedAt createdAt');

  // messages per day last 14 days
  const since = new Date(); since.setDate(since.getDate()-13); since.setHours(0,0,0,0)
  const pipeline: PipelineStage[] = [
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 as 1 } }
  ]
  const byDay = await Message.aggregate(pipeline)

  // project categories breakdown
  const categories = await Project.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])

  res.json({
    stats: {
      visits: 0,
      services,
      projects,
      messages,
      pricing,
    },
    timeseries: {
      messagesPerDay: byDay,
    },
    breakdowns: {
      projectCategories: categories,
    },
    recent: {
      messages: recentMsgs,
      projects: recentProjects,
      services: recentServices,
    },
  });
});

export default router;


