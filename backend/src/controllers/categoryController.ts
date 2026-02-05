import { Request, Response } from 'express';
import Category from '../models/Category';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinaryUtils';

export const getCategories = async (req: Request, res: Response) => {
  try {
    // Optionally filter by isActive for non-admins, but requirement says "same pattern", 
    // usually public sees active only, admin sees all. 
    // For now, let's return all, and frontend filters like Carousel, 
    // OR we can implement query param filtering.
    // Let's stick to returning all and letting frontend/dashboard handle visibility for consistency with Carousel implementation.
    const items = await Category.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, isActive } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    let imageUrl = '';
    
    try {
        const result = await uploadImageToCloudinary(req.file.buffer, 'category');
        imageUrl = result.secure_url;
    } catch (uploadError) {
        return res.status(500).json({ message: 'Image upload failed', error: uploadError });
    }

    const newItem = new Category({
      image: imageUrl,
      name,
      description,
      isActive: isActive === 'true' || isActive === true,
      createdBy: req.user?._id,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // categoryId (e.g., CAT-00001)
    const { name, description, isActive } = req.body;
    
    const existingItem = await Category.findOne({ categoryId: id });
    if (!existingItem) {
        return res.status(404).json({ message: 'Category not found' });
    }

    let imageUrl = existingItem.image;
    
    if (req.file) {
        try {
            await deleteImageFromCloudinary(existingItem.image);
            const result = await uploadImageToCloudinary(req.file.buffer, 'category');
            imageUrl = result.secure_url;
        } catch (uploadError) {
             return res.status(500).json({ message: 'Image upload failed', error: uploadError });
        }
    }

    existingItem.image = imageUrl;
    existingItem.name = name;
    existingItem.description = description;
    if (isActive !== undefined) existingItem.isActive = isActive === 'true' || isActive === true;
    
    const updatedItem = await existingItem.save();

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Category.findOne({ categoryId: id });

    if (!item) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (item.image) {
        await deleteImageFromCloudinary(item.image);
    }

    await item.deleteOne();

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
