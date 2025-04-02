import fs from 'fs';
import { promisify } from 'util';
import { uploadToCloudinary } from '../config/upload.js';

// Convert callback-based fs methods to promise-based
const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);

export const uploadImage = async (req, res) => {  
  if (!req.body.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  let tempFilePath;
  
  try {
    // Extract the base64 data from the data URL
    const base64Data = req.body.file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create a temporary file path with proper extension detection
    const fileExtension = req.body.file.split(';')[0].split('/')[1] || 'png';
    tempFilePath = `temp-${Date.now()}.${fileExtension}`;
    
    // Write the buffer to a temporary file (async)
    await writeFileAsync(tempFilePath, buffer);
    
    // Upload to Cloudinary
    const fileUrl = await uploadToCloudinary(tempFilePath);
    
    // Delete the temporary file after successful upload
    try {
      await unlinkAsync(tempFilePath);
    } catch (unlinkErr) {
      console.error('Error deleting temporary file:', unlinkErr);
      // Schedule cleanup on process exit if immediate deletion fails
      process.on('exit', () => {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      });
    }
    
    return res.json({ imageUrl: fileUrl });
    
  } catch (err) {
    console.error('Upload error:', err);
    
    // Clean up temp file if it exists
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        await unlinkAsync(tempFilePath);
      } catch (cleanupErr) {
        console.error('Error during cleanup:', cleanupErr);
      }
    }
    
    return res.status(500).json({ 
      error: 'Failed to process image upload',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}