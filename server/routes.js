import express from 'express';
import { getWidgets, addWidget } from './db.js';

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

router.get('/widgets', async (req, res) => {
  const widgets = await getWidgets();
  res.json({ data: widgets });
});

router.post('/widgets', async (req, res) => {
  const { title, value } = req.body;
  if (!title || value === undefined || value === null) {
    return res.status(400).json({ error: 'title and value are required' });
  }

  const widget = await addWidget({ title, value });
  res.status(201).json({ data: widget });
});

export default router;
