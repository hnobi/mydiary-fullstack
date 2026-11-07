import { expect } from 'chai';
import { request } from './helpers.js';

describe('App', () => {
  it('GET / returns the welcome message', async () => {
    const res = await request.get('/').expect(200);
    expect(res.body).to.deep.equal({ message: 'Welcome to My Diary application' });
  });

  it('GET /health reports the database as up', async () => {
    const res = await request.get('/health').expect(200);
    expect(res.body).to.include({ status: 'ok', database: 'up' });
  });

  ['/home', '/mydiary', '/api/v1'].forEach((path) => {
    it(`GET ${path} returns 404`, async () => {
      const res = await request.get(path).expect(404);
      expect(res.body).to.deep.equal({ status: 'Failed', message: 'Page not found' });
    });
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request.post('/api/v1/auth/signin')
      .set('Content-Type', 'application/json')
      .send('{"username": ')
      .expect(400);
    expect(res.body.message).to.equal('Request body is not valid JSON');
  });
});
