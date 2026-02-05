import { Request, Response } from 'express';
import SubCategory from '../models/SubCategory';
import Category from '../models/Category';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinaryUtils';

export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const items = await SubCategory.find()
      .populate('parentCategory', 'name categoryId')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sub-categories', error });
  }
};

export const addSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, parentCategory, description, isActive } = req.body;

    // Validate Parent Category
    const categoryExists = await Category.findById(parentCategory);
    if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid Parent Category ID.' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    let imageUrl = '';
    
    try {
        const result = await uploadImageToCloudinary(req.file.buffer, 'subcategory');
        imageUrl = result.secure_url;
    } catch (uploadError) {
        return res.status(500).json({ message: 'Image upload failed', error: uploadError });
    }

    const newItem = new SubCategory({
      image: imageUrl,
      name,
      parentCategory,
      description,
      isActive: isActive === 'true' || isActive === true,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding sub-category', error });
  }
};

export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // subCategoryId (e.g., SUBCAT-00001)
    const { name, parentCategory, description, isActive } = req.body;
    
    const existingItem = await SubCategory.findOne({ subCategoryId: id });
    if (!existingItem) {
        return res.status(404).json({ message: 'Sub-Category not found' });
    }

    if (parentCategory) {
        const categoryExists = await Category.findById(parentCategory);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid Parent Category ID.' });
        }
        existingItem.parentCategory = parentCategory;
    }

    let imageUrl = existingItem.image;
    
    if (req.file) {
        try {
            await deleteImageFromCloudinary(existingItem.image);
            const result = await uploadImageToCloudinary(req.file.buffer, 'subcategory');
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
    res.status(500).json({ message: 'Error updating sub-category', error });
  }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await SubCategory.findOne({ subCategoryId: id });

    if (!item) {
      return res.status(404).json({ message: 'Sub-Category not found' });
    }

    if (item.image) {
        await deleteImageFromCloudinary(item.image);
    }

    await item.deleteOne();

    res.json({ message: 'Sub-Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sub-category', error });
  }
};
