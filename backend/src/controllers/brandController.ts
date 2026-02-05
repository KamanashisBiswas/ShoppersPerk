import { Request, Response } from 'express';
import Brand from '../models/Brand';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinaryUtils';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const items = await Brand.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error });
  }
};

export const addBrand = async (req: Request, res: Response) => {
  try {
    const { name, description, isActive } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    let imageUrl = '';
    
    try {
        const result = await uploadImageToCloudinary(req.file.buffer, 'brand');
        imageUrl = result.secure_url;
    } catch (uploadError) {
        return res.status(500).json({ message: 'Image upload failed', error: uploadError });
    }

    const newItem = new Brand({
      image: imageUrl,
      name,
      description,
      isActive: isActive === 'true' || isActive === true,
      createdBy: req.user?._id,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding brand', error });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // brandId (e.g., BRD-00001)
    const { name, description, isActive } = req.body;
    
    const existingItem = await Brand.findOne({ brandId: id });
    if (!existingItem) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    if (!existingItem.createdBy && req.user) {
        existingItem.createdBy = req.user._id;
    }

    let imageUrl = existingItem.image;
    
    if (req.file) {
        try {
            await deleteImageFromCloudinary(existingItem.image);
            const result = await uploadImageToCloudinary(req.file.buffer, 'brand');
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
    res.status(500).json({ message: 'Error updating brand', error });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Brand.findOne({ brandId: id });

    if (!item) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    if (item.image) {
        await deleteImageFromCloudinary(item.image);
    }

    await item.deleteOne();

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting brand', error });
  }
};
