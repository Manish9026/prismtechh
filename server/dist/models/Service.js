"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const ServiceSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
}, { timestamps: true });
exports.Service = (0, mongoose_1.model)('Service', ServiceSchema);
//# sourceMappingURL=Service.js.map