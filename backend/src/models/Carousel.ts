
import mongoose, { Document, Schema } from 'mongoose';

import { generateCustomId } from '../utils/idGenerator';

export interface ICarouselItem extends Document {
  carouselId: string;
  image: string;
  title?: string;
  subtitle?: string;
  description?: string;
  href?: string;
  order: number;
  isActive: boolean;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const CarouselSchema: Schema = new Schema({
  carouselId: { type: String, unique: true },
  image: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  href: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

CarouselSchema.pre('save', async function () {
  if (this.isNew) {
    this.carouselId = await generateCustomId(
      'CAR',
      mongoose.model('Carousel'),
      'carouselId',
      'carouselId'
    );
  }
});

export default mongoose.model<ICarouselItem>('Carousel', CarouselSchema);
