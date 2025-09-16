import { Schema, model, type Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  icon?: string;
  featured: boolean;
  order?: number;
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Service = model<IService>('Service', ServiceSchema);


