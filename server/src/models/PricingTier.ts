import { Schema, model, type Document } from 'mongoose';

export interface IPricingTier extends Document {
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly' | 'one-time' | 'custom';
  features: Array<{
    text: string;
    included: boolean;
    highlight?: boolean;
  }>;
  popular?: boolean;
  featured?: boolean;
  color?: string;
  icon?: string;
  buttonText?: string;
  buttonLink?: string;
  limitations?: string[];
  addOns?: Array<{
    name: string;
    price: number;
    description: string;
  }>;
  order?: number;
}

const PricingTierSchema = new Schema<IPricingTier>({
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

export const PricingTier = model<IPricingTier>('PricingTier', PricingTierSchema);


