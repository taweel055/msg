import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ScreenshotModel } from '../models/Screenshot';
import { processScreenshot, OCRProvider } from '../services/ocrService';

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/upload', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const provider = (req.body.provider || 'claude') as OCRProvider;
    const groupId = req.body.group_id;

    const ocrResult = await processScreenshot(req.file.path, provider);

    const screenshot = await ScreenshotModel.create({
      filename: req.file.filename,
      filepath: req.file.path,
      group_id: groupId,
      ocr_provider: provider,
      extracted_text: ocrResult.extractedText,
      summary: ocrResult.summary,
    });

    res.status(201).json(screenshot);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process screenshot' });
  }
});

router.get('/', async (req, res) => {
  try {
    const screenshots = await ScreenshotModel.findAll();
    res.json(screenshots);
  } catch (error) {
    console.error('Get screenshots error:', error);
    res.status(500).json({ error: 'Failed to fetch screenshots' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const screenshot = await ScreenshotModel.findById(req.params.id);

    if (!screenshot) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }

    res.json(screenshot);
  } catch (error) {
    console.error('Get screenshot error:', error);
    res.status(500).json({ error: 'Failed to fetch screenshot' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const screenshot = await ScreenshotModel.findById(req.params.id);

    if (!screenshot) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }

    await ScreenshotModel.update(req.params.id, req.body);

    const updated = await ScreenshotModel.findById(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Update screenshot error:', error);
    res.status(500).json({ error: 'Failed to update screenshot' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const screenshot = await ScreenshotModel.findById(req.params.id);

    if (!screenshot) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(screenshot.filepath)) {
      fs.unlinkSync(screenshot.filepath);
    }

    await ScreenshotModel.delete(req.params.id);

    res.json({ message: 'Screenshot deleted successfully' });
  } catch (error) {
    console.error('Delete screenshot error:', error);
    res.status(500).json({ error: 'Failed to delete screenshot' });
  }
});

export default router;
