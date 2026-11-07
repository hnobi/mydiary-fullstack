import app from './app.js';
import config from './config/env.js';
import db from './models/db.js';
import { stopAllReminders } from './services/reminders.js';

const server = app.listen(config.port, () => {
  console.log(`MyDiary API listening on port ${config.port} (${config.nodeEnv})`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`);
  stopAllReminders();
  server.close(() => db.end().finally(() => process.exit(0)));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
