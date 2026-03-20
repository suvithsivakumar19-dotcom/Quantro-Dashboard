import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes.js';
import { initDB } from './db.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({ origin: ['http://localhost:8080', 'http://127.0.0.1:8080'] }));
app.use(express.json());

await initDB();

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Quantro Dashboard API is running with MongoDB');
});

const server = app.listen(port, () => {
  console.log(`🚀 API server started on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

