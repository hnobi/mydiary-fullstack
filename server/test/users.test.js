import { expect } from 'chai';
import { request, createUser } from './helpers.js';

describe('User profile', () => {
  let token;
  let user;
  let password;

  before(async () => {
    ({ token, user, password } = await createUser({ fullname: 'Profile Person' }));
  });

  describe('GET /api/v1/user/details', () => {
    it('returns the profile without the password', async () => {
      const res = await request.get('/api/v1/user/details').set('x-access-token', token).expect(200);
      expect(res.body.message).to.equal('successfull retrived user details');
      expect(res.body.data).to.include({
        id: user.id, fullname: 'Profile Person', username: user.username, reminder: 0
      });
      expect(res.body.data).to.not.have.property('password');
    });

    it('returns 401 with an invalid token', async () => {
      await request.get('/api/v1/user/details').set('x-access-token', 'nope').expect(401);
    });
  });

  describe('PUT /api/v1/user/details', () => {
    it('updates only the fields sent and keeps the password when none is sent', async () => {
      const res = await request.put('/api/v1/user/details')
        .set('x-access-token', token)
        .send({ fullname: 'Renamed Person', reminder: '2' })
        .expect(200);
      expect(res.body.message).to.equal('successfully modified your profile');
      expect(res.body.userDetails).to.include({
        fullname: 'Renamed Person', username: user.username, email: user.email, reminder: 2
      });
      expect(res.body.userDetails).to.not.have.property('password');

      await request.post('/api/v1/auth/signin')
        .send({ username: user.username, password })
        .expect(200);
    });

    it('changes the password when a new one is sent', async () => {
      await request.put('/api/v1/user/details')
        .set('x-access-token', token)
        .send({ password: 'brand-new-pass' })
        .expect(200);
      await request.post('/api/v1/auth/signin')
        .send({ username: user.username, password: 'brand-new-pass' })
        .expect(200);
      await request.post('/api/v1/auth/signin')
        .send({ username: user.username, password })
        .expect(400);
    });

    it('returns 409 when taking another user\'s username', async () => {
      const { user: other } = await createUser();
      await request.put('/api/v1/user/details')
        .set('x-access-token', token)
        .send({ username: other.username })
        .expect(409);
    });

    it('returns 400 for invalid fields', async () => {
      const res = await request.put('/api/v1/user/details')
        .set('x-access-token', token)
        .send({ email: 'not-an-email', reminder: 'often', password: 'short' })
        .expect(400);
      expect(res.body.errors).to.have.keys('email', 'reminder', 'password');
    });

    it('returns 401 with an invalid token', async () => {
      const res = await request.put('/api/v1/user/details')
        .set('x-access-token', 'nope')
        .send({ fullname: 'Nobody' })
        .expect(401);
      expect(res.body.message).to.equal('Authentication failed. Token is either invalid or expired');
    });
  });

  describe('PUT /api/v1/user/upload', () => {
    it('returns 400 when no image is attached', async () => {
      await request.put('/api/v1/user/upload').set('x-access-token', token).expect(400);
    });
  });
});
