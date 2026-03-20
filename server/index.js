import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { initDB } from './db.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({ origin: ['http://localhost:8080', 'http://127.0.0.1:8080'] }));
app.use(express.json());

await initDB();

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Quantro Dashboard API is running');
});

app.listen(port, () => {
  console.log(`🚀 API server started on http://localhost:${port}`);
});
