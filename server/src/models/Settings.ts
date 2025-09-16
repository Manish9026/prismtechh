import { Schema, model, type Document } from 'mongoose';

export interface ISettings extends Document {
  logo?: string;
  favicon?: string;
  theme?: 'prism-dark';
  seo?: { title?: string; description?: string; keywords?: string[] };
  social?: { linkedin?: string; github?: string; twitter?: string };
  home?: { headline?: string; tagline?: string; background?: string; ctas?: { label: string; href: string }[] };
  about?: { mission?: string; vision?: string; values?: string[] };
  testimonials?: { name: string; role?: string; quote: string; photo?: string }[];
  contact?: { email?: string; phone?: string; address?: string; mapEmbedUrl?: string };
}

const SettingsSchema = new Schema<ISettings>({
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

export const Settings = model<ISettings>('Settings', SettingsSchema);


