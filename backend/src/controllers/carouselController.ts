
import { Request, Response } from 'express';
import Carousel from '../models/Carousel';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinaryUtils';



export const getCarouselItems = async (req: Request, res: Response) => {
  try {
    const items = await Carousel.find().sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching carousel items', error });
  }
};

export const addCarouselItem = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, description, href, order } = req.body;

    // 1. Validation Logic FIRST (as requested)
    // Manually check if required fields are present (if any)
    // Image is required for new item
    if (!req.file) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    // 2. Upload Image to Cloudinary
    let imageUrl = '';
    
    try {
        const result = await uploadImageToCloudinary(req.file.buffer, 'carousel');
        imageUrl = result.secure_url;
    } catch (uploadError) {
        return res.status(500).json({ message: 'Image upload failed', error: uploadError });
    }

    // 3. Save Data
    const newItem = new Carousel({
      image: imageUrl,
      title,
      subtitle,
      description,
      href,
      order: order || 0,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding carousel item', error });
  }
};

export const updateCarouselItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // This receives carouselId (e.g., CAR-00001)
    const { title, subtitle, description, href, order } = req.body;
    
    // Find existing item by carouselId
    const existingItem = await Carousel.findOne({ carouselId: id });
    if (!existingItem) {
        return res.status(404).json({ message: 'Item not found' });
    }

    // 1. Validation (if any specific logic needed)

    // 2. Upload Image (If provided)
    let imageUrl = existingItem.image;
    
    if (req.file) {
        try {
            // Delete old image if it exists on Cloudinary
            await deleteImageFromCloudinary(existingItem.image);

            const result = await uploadImageToCloudinary(req.file.buffer, 'carousel');
            imageUrl = result.secure_url;
        } catch (uploadError) {
             return res.status(500).json({ message: 'Image upload failed', error: uploadError });
        }
    }

    // 3. Update Data
    existingItem.image = imageUrl;
    existingItem.title = title;
    existingItem.subtitle = subtitle;
    existingItem.description = description;
    existingItem.href = href;
    if (order) existingItem.order = order;
    
    const updatedItem = await existingItem.save();

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating carousel item', error });
  }
};

export const deleteCarouselItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // This receives carouselId
    const item = await Carousel.findOne({ carouselId: id });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete image from Cloudinary
    if (item.image) {
        await deleteImageFromCloudinary(item.image);
    }

    await item.deleteOne();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting carousel item', error });
  }
};
