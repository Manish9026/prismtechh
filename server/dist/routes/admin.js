"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Service_1 = require("../models/Service");
const Project_1 = require("../models/Project");
const PricingTier_1 = require("../models/PricingTier");
const Message_1 = require("../models/Message");
const router = (0, express_1.Router)();
// Basic stats for dashboard
router.get('/stats', auth_1.requireAuth, async (_req, res) => {
    const [services, projects, pricing, messages] = await Promise.all([
        Service_1.Service.countDocuments(),
        Project_1.Project.countDocuments(),
        PricingTier_1.PricingTier.countDocuments(),
        Message_1.Message.countDocuments(),
    ]);
    // naive recent activity: latest 5 messages and 5 projects/services updates
    const recentMsgs = await Message_1.Message.find().sort({ updatedAt: -1 }).limit(5).select('email status updatedAt createdAt');
    const recentProjects = await Project_1.Project.find().sort({ updatedAt: -1 }).limit(5).select('title updatedAt createdAt');
    const recentServices = await Service_1.Service.find().sort({ updatedAt: -1 }).limit(5).select('title updatedAt createdAt');
    // messages per day last 14 days
    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);
    const pipeline = [
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ];
    const byDay = await Message_1.Message.aggregate(pipeline);
    // project categories breakdown
    const categories = await Project_1.Project.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
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
exports.default = router;
//# sourceMappingURL=admin.js.map