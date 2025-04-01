import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controller/imageController.js';

const imageRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

imageRouter.post('/upload', upload.single('file'), uploadImage);

export default imageRouter;