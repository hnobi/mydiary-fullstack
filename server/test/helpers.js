import supertest from 'supertest';
import app from '../src/app.js';

export const request = supertest(app);

let counter = 0;

/**
 * Signs up a fresh user through the API.
 * @param {object} overrides fields to override
 * @returns {Promise<{ token: string, user: object, password: string }>}
 */
export const createUser = async (overrides = {}) => {
  counter += 1;
  const body = {
    fullname: 'Test User',
    username: `user${Date.now() % 100000}x${counter}`.slice(0, 15),
    email: `user${counter}.${Date.now()}@example.com`,
    password: 'password123',
    ...overrides,
  };
  const res = await request.post('/api/v1/auth/signup').send(body);
  if (res.status !== 201) throw new Error(`signup failed: ${res.status} ${JSON.stringify(res.body)}`);
  return { token: res.body.token, user: res.body.data, password: body.password };
};

export const createEntry = async (token, overrides = {}) => {
  const res = await request.post('/api/v1/entries')
    .set('x-access-token', token)
    .send({
      title: 'A quiet morning',
      date: '2018-09-10',
      entry: 'Reflection describes a real or imaginary scene, event, interaction',
      ...overrides,
    });
  if (res.status !== 201) throw new Error(`create entry failed: ${res.status} ${JSON.stringify(res.body)}`);
  return res.body.data;
};
