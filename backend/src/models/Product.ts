import mongoose, { Document, Schema } from 'mongoose';
import { generateCustomId } from '../utils/idGenerator';

const variationSchema = new Schema({
  size: { type: String },
  color: { type: String },
  basePrice: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  stock: { type: Number, required: true, min: 0 },
});

variationSchema.pre('validate', function (this: any, next: any) {
  if (!this.size && !this.color) {
    next(new Error('Either size or color is required for a variation.'));
  } else {
    next();
  }
});

export interface IProduct extends Document {
  productId: string;
  name: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId;
  subCategory: mongoose.Schema.Types.ObjectId;
  brand: mongoose.Schema.Types.ObjectId;
  bannerImage: string;
  images: string[];
  variation: {
    size?: string;
    color?: string;
    basePrice: number;
    discountPrice?: number;
    stock: number;
  }[];
  isActive: boolean;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const productSchema: Schema = new Schema(
  {
    productId: {
      type: String,
      unique: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    bannerImage: { type: String, required: true },
    images: [{ type: String, required: true }],
    variation: {
      type: [variationSchema],
      required: true,
      validate: (v: any[]) => Array.isArray(v) && v.length > 0,
    },
    isActive: {
      type: Boolean,
      required: [true, 'isActive status is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Generate custom productId before saving a new document
productSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.productId = await generateCustomId(
      'PRD',
      mongoose.model('Product'),
      'productId',
      'productId' // Assuming logic uses pattern 'Product' or similar inside, but matching Category.ts usage
    );
  }
  next();
});

export default mongoose.model<IProduct>('Product', productSchema);
