"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscribe_1 = __importDefault(require("./subscribe"));
const uploads_1 = __importDefault(require("./uploads"));
const auth_1 = __importDefault(require("./auth"));
const services_1 = __importDefault(require("./services"));
const projects_1 = __importDefault(require("./projects"));
const pricing_1 = __importDefault(require("./pricing"));
const team_1 = __importDefault(require("./team"));
const messages_1 = __importDefault(require("./messages"));
const settings_1 = __importDefault(require("./settings"));
const admin_1 = __importDefault(require("./admin"));
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.json({ message: 'Prism Tech API v1' });
});
router.use('/subscribe', subscribe_1.default);
router.use('/uploads', uploads_1.default);
router.use('/auth', auth_1.default);
router.use('/services', services_1.default);
router.use('/projects', projects_1.default);
router.use('/pricing', pricing_1.default);
router.use('/team', team_1.default);
router.use('/messages', messages_1.default);
router.use('/settings', settings_1.default);
router.use('/admin', admin_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map