import db from '../src/models/db.js';
import { migrate } from '../src/models/migrate.js';
import { stopAllReminders } from '../src/services/reminders.js';

// Mocha root hooks: start every run from empty tables in the TEST database.
export const mochaHooks = {
  async beforeAll() {
    await migrate({ reset: true });
  },
  async afterAll() {
    stopAllReminders();
    await db.end();
  },
};
