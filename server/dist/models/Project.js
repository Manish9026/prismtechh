"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const ProjectSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Web App', 'CMS', 'Cybersecurity', 'Cloud'], required: true },
    image: { type: String },
    images: [{ type: String }],
    link: { type: String },
    clientName: { type: String },
    clientEmail: { type: String },
    timeline: { type: String },
    status: { type: String, enum: ['Draft', 'In Progress', 'Completed', 'Archived'], default: 'Draft' },
    featured: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    order: { type: Number, default: 0 },
}, { timestamps: true });
exports.Project = (0, mongoose_1.model)('Project', ProjectSchema);
//# sourceMappingURL=Project.js.map