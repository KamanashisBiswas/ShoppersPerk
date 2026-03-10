import { Request, Response } from 'express';
import Product from '../models/Product';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinaryUtils';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .populate('brand', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      brand,
      isActive,
      variation, // This might be a JSON string from FormData
    } = req.body;

    // Handle Image Uploads
    // req.files is expected to be: { bannerImage: [file], images: [file, file] }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files || !files.bannerImage || files.bannerImage.length === 0) {
        return res.status(400).json({ message: 'Banner image is required.' });
    }
    if (!files.images || files.images.length === 0) {
         return res.status(400).json({ message: 'At least one product image is required.' });
    }

    // Upload Banner
    let bannerImageUrl = '';
    try {
        const result = await uploadImageToCloudinary(files.bannerImage[0].buffer, 'products/banners');
        bannerImageUrl = result.secure_url;
    } catch (error) {
        return res.status(500).json({ message: 'Banner upload failed', error });
    }

    // Upload Gallery Images
    const imageUrls: string[] = [];
    try {
        const uploadPromises = files.images.map(file => 
            uploadImageToCloudinary(file.buffer, 'products/gallery')
        );
        const results = await Promise.all(uploadPromises);
        results.forEach(r => imageUrls.push(r.secure_url));
    } catch (error) {
        return res.status(500).json({ message: 'Gallery upload failed', error });
    }

    // Parse Variations
    let parsedVariations = variation;
    if (typeof variation === 'string') {
        try {
            parsedVariations = JSON.parse(variation);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid variation format' });
        }
    }

    const newProduct = new Product({
      name,
      description,
      category,
      subCategory,
      brand,
      bannerImage: bannerImageUrl,
      images: imageUrls,
      variation: parsedVariations,
      isActive: isActive === 'true' || isActive === true,
      createdBy: req.user?._id,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // productId or _id? Usually params have _id or customId. 
    // Best to support finding by unique productId or _id. 
    // Controller usually receives whatever is in route param.
    // Let's assume route uses :id which corresponds to productId (PRD-xxx).
    
    const product = await Product.findOne({ productId: id });
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const {
        name,
        description,
        category,
        subCategory,
        brand,
        isActive,
        variation,
    } = req.body;

    // Update Text Fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (subCategory) product.subCategory = subCategory;
    if (brand) product.brand = brand;
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
    
    // Update Variations
    if (variation) {
        let parsedVariations = variation;
        if (typeof variation === 'string') {
             try {
                parsedVariations = JSON.parse(variation);
            } catch (e) {
                return res.status(400).json({ message: 'Invalid variation format' });
            }
        }
        product.variation = parsedVariations;
    }

    // Handle Images
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // Update Banner
    if (files && files.bannerImage && files.bannerImage.length > 0) {
        try {
            // Delete old banner
            if (product.bannerImage) {
                 await deleteImageFromCloudinary(product.bannerImage);
            }
            const result = await uploadImageToCloudinary(files.bannerImage[0].buffer, 'products/banners');
            product.bannerImage = result.secure_url;
        } catch (error) {
             return res.status(500).json({ message: 'Banner upload failed', error });
        }
    }

    // Update Gallery Images
    // Strategy: If new images are provided, do we append or replace?
    // User request: "same pattern". Usually simple implementation replaces all if new ones provided.
    // Or we might expect a mix. For complexity reduction in this task:
    // If 'images' provided in files, REPLACE ALL existing gallery images.
    if (files && files.images && files.images.length > 0) {
        try {
             // Delete old images
             if (product.images && product.images.length > 0) {
                 await Promise.all(product.images.map(url => deleteImageFromCloudinary(url)));
             }
             
             const imageUrls: string[] = [];
             const uploadPromises = files.images.map(file => 
                uploadImageToCloudinary(file.buffer, 'products/gallery')
            );
            const results = await Promise.all(uploadPromises);
            results.forEach(r => imageUrls.push(r.secure_url));
            
            product.images = imageUrls;
        } catch (error) {
            return res.status(500).json({ message: 'Gallery upload failed', error });
        }
    }

    // We might also update createdBy? Usually only on creation, or lastUpdatedBy on update.
    // product.createdBy = req.user._id; // optional update

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete Banner
    if (product.bannerImage) {
        await deleteImageFromCloudinary(product.bannerImage);
    }

    // Delete Gallery Images
    if (product.images && product.images.length > 0) {
        await Promise.all(product.images.map(url => deleteImageFromCloudinary(url)));
    }

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
