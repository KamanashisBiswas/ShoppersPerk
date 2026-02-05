import mongoose, { Document, Schema } from 'mongoose';
import { generateCustomId } from '../utils/idGenerator';

export interface ICategory extends Document {
  categoryId: string;
  name: string;
  description?: string;
  image: string;
  isActive: boolean;
}

const CategorySchema: Schema = new Schema({
  categoryId: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

CategorySchema.pre('save', async function () {
  if (this.isNew) {
    this.categoryId = await generateCustomId(
      'CAT',
      mongoose.model('Category'),
      'categoryId',
      'categoryId'
    );
  }
});

export default mongoose.model<ICategory>('Category', CategorySchema);
