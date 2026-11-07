import { fileURLToPath } from 'node:url';
import db from './db.js';

const DROP_TABLES = `
  DROP TABLE IF EXISTS entries CASCADE;
  DROP TABLE IF EXISTS users CASCADE;
`;

const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(150) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reminder INTEGER DEFAULT 0,
    image VARCHAR(255)
  );

  CREATE TABLE IF NOT EXISTS entries(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    entry TEXT NOT NULL,
    userId INT REFERENCES users(id) ON DELETE CASCADE,
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
`;

/**
 * Creates the tables if they are missing.
 * @param {{ reset?: boolean }} options reset drops existing tables (and data) first
 * @returns {Promise<void>}
 */
export const migrate = async ({ reset = false } = {}) => {
  if (reset) await db.query(DROP_TABLES);
  await db.query(CREATE_TABLES);
};

// Run directly: `npm run migrate` or `npm run migrate:reset`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const reset = process.argv.includes('--reset');
  migrate({ reset })
    .then(() => console.log(`Tables ${reset ? 'reset' : 'ready'}`))
    .catch((err) => {
      console.error('Migration failed:', err.message);
      process.exitCode = 1;
    })
    .finally(() => db.end());
}
