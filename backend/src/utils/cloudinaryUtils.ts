
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

const ROOT_FOLDER = 'shoppers-perk-new';

/**
 * Uploads an image buffer to Cloudinary.
 * @param buffer - The image file buffer.
 * @param subfolder - The subfolder within the root folder (e.g., 'carousel', 'products').
 * @returns Promise<CloudinaryUploadResult>
 */
export const uploadImageToCloudinary = (buffer: Buffer, subfolder: string): Promise<any> => {
  const folderPath = subfolder ? `${ROOT_FOLDER}/${subfolder}` : ROOT_FOLDER;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderPath },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/**
 * Extracts the public ID from a Cloudinary URL and deletes the image.
 * Supports the specific folder structure of this project.
 * @param imageUrl - The full secure_url of the image.
 * @returns Promise<any>
 */
export const deleteImageFromCloudinary = async (imageUrl: string): Promise<any> => {
  if (!imageUrl) return null;

  try {
     const parts = imageUrl.split('/');
     
     // Find where 'upload' is to start looking for the path
     // URL Structure: https://res.cloudinary.com/.../upload/v1234/shoppers-perk-new/carousel/image.jpg
     const uploadIndex = parts.findIndex(p => p === 'upload');
     
     if (uploadIndex === -1 || parts.length <= uploadIndex + 2) {
         // Fallback for flat structure or unexpected URL
         const lastPart = parts[parts.length - 1];
         return await cloudinary.uploader.destroy(lastPart.split('.')[0]);
     }

     // parts[uploadIndex + 1] is the version (e.g., v17342...)
     // The public ID starts after the version
     const pathParts = parts.slice(uploadIndex + 2);
     const pathWithExt = pathParts.join('/');
     const publicId = pathWithExt.split('.')[0]; // Remove extension

     return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
     console.error('Error deleting image from Cloudinary:', error);
     throw error;
  }
};
