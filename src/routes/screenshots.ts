import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ScreenshotModel } from '../models/Screenshot';
import { processScreenshot, processChat, OCRProvider } from '../services/ocrService';

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
    const imageTypes = /jpeg|jpg|png|gif|webp/;
    const textTypes = /txt/;
    const extname = path.extname(file.originalname).toLowerCase();

    const isImage = imageTypes.test(extname) || imageTypes.test(file.mimetype);
    const isText = textTypes.test(extname) || file.mimetype === 'text/plain';

    if (isImage || isText) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, gif, webp) or text files (.txt) are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/upload', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const provider = (req.body.provider || 'deepseek') as OCRProvider;
    const groupId = req.body.group_id;
    const ext = path.extname(req.file.originalname).toLowerCase();

    // Determine if it's a chat file or screenshot
    const isTextFile = ext === '.txt';
    const contentType = isTextFile ? 'chat' : 'screenshot';

    let ocrResult;
    if (isTextFile) {
      // Process as WhatsApp chat
      ocrResult = await processChat(req.file.path, provider);
    } else {
      // Process as screenshot
      ocrResult = await processScreenshot(req.file.path, provider);
    }

    const screenshot = await ScreenshotModel.create({
      filename: req.file.filename,
      filepath: req.file.path,
      group_id: groupId,
      content_type: contentType,
      ocr_provider: provider,
      extracted_text: ocrResult.extractedText,
      summary: ocrResult.summary,
    });

    res.status(201).json(screenshot);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process file' });
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
