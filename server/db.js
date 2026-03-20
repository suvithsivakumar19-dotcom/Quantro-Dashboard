import mongoose from 'mongoose';

const widgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Widget = mongoose.model('Widget', widgetSchema);

export async function initDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/quantro-dashboard');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function getWidgets() {
  return await Widget.find().sort({ createdAt: -1 });
}

export async function addWidget({ title, value }) {
  const widget = new Widget({ title, value });
  return await widget.save();
}

