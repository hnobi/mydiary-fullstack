import express from 'express';
import cors from 'cors';
import apiRoute from './routes/router.js';
import db from './models/db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to My Diary application' });
});

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'up' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'down', message: err.message });
  }
});

app.use('/api/v1', apiRoute);

app.use((req, res) => {
  res.status(404).json({ status: 'Failed', message: 'Page not found' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'Failed', message: 'Request body is not valid JSON' });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ status: 'Failed', message: 'Image must be 5MB or smaller' });
  }
  if (process.env.NODE_ENV !== 'test') console.error(err);
  return res.status(500).json({ status: 'Failed', message: 'Something went wrong on the server' });
});

export default app;
