import mongoose, { Document, Schema } from 'mongoose';
import { generateCustomId } from '../utils/idGenerator';

export interface ISubCategory extends Document {
  subCategoryId: string;
  name: string;
  parentCategory: mongoose.Schema.Types.ObjectId;
  description?: string;
  image: string;
  isActive: boolean;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const SubCategorySchema: Schema = new Schema({
  subCategoryId: { type: String, unique: true },
  name: { type: String, required: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

SubCategorySchema.pre('save', async function () {
  if (this.isNew) {
    this.subCategoryId = await generateCustomId(
      'SUBCAT',
      mongoose.model('SubCategory'),
      'subCategoryId',
      'subCategoryId'
    );
  }
});

export default mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);
