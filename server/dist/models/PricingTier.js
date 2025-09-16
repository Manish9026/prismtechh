"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingTier = void 0;
const mongoose_1 = require("mongoose");
const PricingTierSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    billingPeriod: { type: String, enum: ['monthly', 'yearly', 'one-time', 'custom'], default: 'monthly' },
    features: [{
            text: { type: String, required: true },
            included: { type: Boolean, default: true },
            highlight: { type: Boolean, default: false }
        }],
    popular: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    color: { type: String, default: '#8b5cf6' },
    icon: { type: String },
    buttonText: { type: String, default: 'Get Started' },
    buttonLink: { type: String },
    limitations: [{ type: String }],
    addOns: [{
            name: { type: String, required: true },
            price: { type: Number, required: true },
            description: { type: String }
        }],
    order: { type: Number, default: 0 },
}, { timestamps: true });
exports.PricingTier = (0, mongoose_1.model)('PricingTier', PricingTierSchema);
//# sourceMappingURL=PricingTier.js.map