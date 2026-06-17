import mongoose, { Schema, Document } from 'mongoose';

export interface IFormSubmission extends Document {
  name: string;
  firmName: string;
  address: string;
  mobile: string;
  gst?: string;
  dealingIn: string;
  createdAt: Date;
}

const FormSubmissionSchema: Schema = new Schema({
  name: { type: String, required: true },
  firmName: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
  gst: { type: String },
  dealingIn: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.FormSubmission || mongoose.model<IFormSubmission>('FormSubmission', FormSubmissionSchema);
