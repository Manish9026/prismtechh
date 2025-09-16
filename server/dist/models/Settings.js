"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const mongoose_1 = require("mongoose");
const SettingsSchema = new mongoose_1.Schema({
    logo: String,
    favicon: String,
    theme: { type: String, default: 'prism-dark' },
    seo: {
        title: String,
        description: String,
        keywords: [String],
    },
    social: {
        linkedin: String,
        github: String,
        twitter: String,
    },
    home: {
        headline: String,
        tagline: String,
        background: String,
        ctas: [{ label: String, href: String }],
    },
    about: {
        mission: String,
        vision: String,
        values: [String],
    },
    testimonials: [{ name: String, role: String, quote: String, photo: String }],
    contact: {
        email: String,
        phone: String,
        address: String,
        mapEmbedUrl: String,
    },
}, { timestamps: true });
exports.Settings = (0, mongoose_1.model)('Settings', SettingsSchema);
//# sourceMappingURL=Settings.js.map