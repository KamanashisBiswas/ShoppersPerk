
import mongoose, { Model, Document } from 'mongoose';
import Counter from '../models/Counter';

/**
 * Generates a sequential custom ID with a given prefix, filling gaps first.
 * Example: 'VAR-00001', 'CAT-00002'
 * @param prefix - The prefix for the ID (e.g., 'VAR', 'CAT').
 * @param model - The mongoose model (e.g., Category, Brand).
 * @param idField - The field name for custom ID (e.g., 'categoryId').
 * @param counterId - The Counter collection ID.
 * @returns {Promise<string>} The generated custom ID.
 */
export const generateCustomId = async (
  prefix: string,
  model: Model<any>,
  idField: string,
  counterId: string
): Promise<string> => {
  // Get all existing serials from DB
  const docs = await model.find({}, { [idField]: 1, _id: 0 });
  const serials = docs
    .map((doc: any) => {
      const parts = doc[idField]?.split("-");
      return parts && parts[1] ? parseInt(parts[1], 10) : null;
    })
    .filter((num: number | null) => num !== null)
    .sort((a: number, b: number) => a - b);

  // Find first missing serial (gap)
  let nextSerial = 1;
  // Check if serials is empty or not
  if (serials.length > 0) {
      // If the first one isn't 1, then 1 is the gap
      if (serials[0] !== 1) {
          nextSerial = 1;
      } else {
          // Look for gap
          let foundGap = false;
          for (let i = 0; i < serials.length; i++) {
            if (serials[i] !== i + 1) {
              nextSerial = i + 1;
              foundGap = true;
              break;
            }
          }
          // If no gap found within the sequence, nextSerial is length + 1
          if (!foundGap) {
            nextSerial = serials.length + 1;
          }
      }
  }

  // Update counter collection
  await Counter.findByIdAndUpdate(
    counterId,
    { seq: nextSerial },
    { upsert: true, new: true }
  );

  // Pad the sequence number with leading zeros to a fixed length of 5
  const paddedSeq = String(nextSerial).padStart(5, "0");
  return `${prefix}-${paddedSeq}`;
};
