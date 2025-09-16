import { Schema, model, type Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read';
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread','read'], default: 'unread' },
}, { timestamps: true });

export const Message = model<IMessage>('Message', MessageSchema);


