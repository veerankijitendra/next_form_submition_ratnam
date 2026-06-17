import mongoose, { Schema, Document } from 'mongoose';

export interface IFormSubmission extends Document {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  age?: string;
  items: string;
  total?: number;
  payment?: string;
  notes?: string;
  createdAt: Date;
}

const FormSubmissionSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  city: { type: String },
  age: { type: String },
  items: { type: String, required: true },
  total: { type: Number },
  payment: { type: String },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.FormSubmission || mongoose.model<IFormSubmission>('FormSubmission', FormSubmissionSchema);
