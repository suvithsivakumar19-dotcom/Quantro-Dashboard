import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'quantro-db.json');

async function readDB() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { widgets: [], nextId: 1 };
    }
    throw error;
  }
}

async function writeDB(db) {
  await fs.writeFile(filePath, JSON.stringify(db, null, 2), 'utf8');
}

export async function initDB() {
  const db = await readDB();
  db.widgets = db.widgets || [];
  db.nextId = db.nextId || 1;
  await writeDB(db);
}

export async function getWidgets() {
  const db = await readDB();
  return (db.widgets || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addWidget({ title, value }) {
  const db = await readDB();
  const nextId = db.nextId || 1;
  const widget = {
    id: nextId,
    title,
    value: Number(value),
    createdAt: new Date().toISOString(),
  };
  db.widgets = db.widgets || [];
  db.widgets.push(widget);
  db.nextId = nextId + 1;
  await writeDB(db);
  return widget;
}
