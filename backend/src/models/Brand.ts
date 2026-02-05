import mongoose, { Document, Schema } from 'mongoose';
import { generateCustomId } from '../utils/idGenerator';

export interface IBrand extends Document {
  brandId: string;
  name: string;
  description?: string;
  image: string;
  isActive: boolean;
}

const BrandSchema: Schema = new Schema({
  brandId: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

BrandSchema.pre('save', async function () {
  if (this.isNew) {
    this.brandId = await generateCustomId(
      'BRD',
      mongoose.model('Brand'),
      'brandId',
      'brandId'
    );
  }
});

export default mongoose.model<IBrand>('Brand', BrandSchema);
