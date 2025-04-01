import fs from 'fs';
import { uploadToCloudinary } from '../config/upload.js';

export const uploadImage = async (req, res) => {  
  if (!req.body.file) return res.json({ error: 'No file uploaded' });

  try {
    // Extract the base64 data from the data URL
    const base64Data = req.body.file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create a temporary file path
    const tempFilePath = `temp-${Date.now()}.png`; // or use the appropriate extension
    
    // Write the buffer to a temporary file
    fs.writeFileSync(tempFilePath, buffer);
    
    // Upload to Cloudinary
    const fileUrl = await uploadToCloudinary(tempFilePath);
    
    // Delete the temporary file after successful upload
    fs.unlink(tempFilePath, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });
    
    res.json({ imageUrl: fileUrl });
    
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload to Cloudinary' });
  }
}