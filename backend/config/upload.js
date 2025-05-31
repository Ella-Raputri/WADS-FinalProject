import cloudinary from './cloudinary.js'; 
import fs from 'fs';

// upload image to cloudinary
export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log('File uploaded to Cloudinary:', result);
    return result.url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};