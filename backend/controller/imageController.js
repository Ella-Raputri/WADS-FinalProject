import fs from 'fs';  // Add this import
import { uploadToCloudinary } from '../config/upload.js';

export const uploadImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
    try {
      const fileUrl = await uploadToCloudinary(req.file.path);
      
      // Delete the local file after successful upload
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting local file:', err);
      });
      
      res.json({ imageUrl: fileUrl });
      
    } catch (err) {
      // Also delete the file if upload fails
      fs.unlink(req.file.path, () => {});
      res.status(500).json({ error: 'Failed to upload to Cloudinary' });
    }
  }