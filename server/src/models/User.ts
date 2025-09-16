import { Schema, model, type Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  role: 'admin' | 'editor';
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);

