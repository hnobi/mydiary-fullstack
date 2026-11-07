import pg from 'pg';
import config from '../config/env.js';

const db = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl ? { rejectUnauthorized: false } : false,
});

export default db;
