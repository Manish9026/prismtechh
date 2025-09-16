import { Schema, model, type Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  role: string;
  bio?: string;
  photo?: string; // filename or URL
  order?: number;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  photo: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const TeamMember = model<ITeamMember>('TeamMember', TeamMemberSchema);


