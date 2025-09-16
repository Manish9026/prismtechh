import { Schema, model, type Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  category: 'Web App' | 'CMS' | 'Cybersecurity' | 'Cloud';
  image?: string; // filename or URL
  images?: string[]; // multiple images for gallery
  link?: string;  // external link (GitHub/Live)
  clientName?: string;
  clientEmail?: string;
  timeline?: string; // e.g., "3 months", "6 weeks"
  status: 'Draft' | 'In Progress' | 'Completed' | 'Archived';
  featured: boolean;
  startDate?: Date;
  endDate?: Date;
  order?: number;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Web App','CMS','Cybersecurity','Cloud'], required: true },
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

export const Project = model<IProject>('Project', ProjectSchema);


