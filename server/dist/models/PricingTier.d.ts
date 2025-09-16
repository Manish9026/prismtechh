import { type Document } from 'mongoose';
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
export declare const PricingTier: import("mongoose").Model<IPricingTier, {}, {}, {}, Document<unknown, {}, IPricingTier, {}, {}> & IPricingTier & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=PricingTier.d.ts.map