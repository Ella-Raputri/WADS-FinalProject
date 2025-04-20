import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controller/imageController.js';

const imageRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Image
 *   description: Image uploading related APIs
 */

const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/image/upload:
 *   post:
 *     summary: Upload an image in base64 format
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded image string (including data URI prefix)
 *                 example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/v12345678/sample.jpg
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Upload failed
 */
imageRouter.post('/upload', upload.single('file'), uploadImage);

export default imageRouter;