import { expect } from 'chai';
import { request } from './helpers.js';

describe('Auth', () => {
  const user = {
    fullname: 'Hammed Noibi',
    username: 'hnobi',
    email: 'hnobi09@yahoo.com',
    password: '12345678'
  };

  describe('POST /api/v1/auth/signup', () => {
    it('creates an account, returns a token and never returns the password', async () => {
      const res = await request.post('/api/v1/auth/signup').send(user).expect(201);
      expect(res.body.status).to.equal('Success');
      expect(res.body.message).to.equal('Successfully created myDiary account');
      expect(res.body.data).to.include({ username: 'hnobi', email: 'hnobi09@yahoo.com' });
      expect(res.body.data).to.not.have.property('password');
      expect(res.body.token).to.be.a('string');
    });

    it('returns 409 when the username or email already exists', async () => {
      const res = await request.post('/api/v1/auth/signup').send(user).expect(409);
      expect(res.body).to.deep.equal({ status: 'Failed', message: 'User already exist' });
    });

    it('returns 400 when fields are missing', async () => {
      const res = await request.post('/api/v1/auth/signup').send({}).expect(400);
      expect(res.body).to.deep.equal({ message: 'All or some of the field is/are undefined' });
    });

    it('returns 400 with a message per empty field', async () => {
      const res = await request.post('/api/v1/auth/signup')
        .send({
          fullname: '', username: '', email: '', password: ''
        })
        .expect(400);
      expect(res.body.errors).to.deep.equal({
        fullname: 'fullname  is required',
        username: 'username  is required',
        email: 'email is required',
        password: 'password  is required'
      });
    });

    it('returns 400 with a message per invalid field', async () => {
      const res = await request.post('/api/v1/auth/signup')
        .send({
          fullname: '300hamed', username: 'h', email: 'hboy.com', password: 'dddd'
        })
        .expect(400);
      expect(res.body.errors).to.deep.equal({
        fullname: 'fullname  must not contain numbers',
        username: 'username must be between 2 to 15 characters',
        email: 'Enter a valid email address',
        password: 'password must be eight character or more'
      });
    });

    it('treats SQL in the username as plain text', async () => {
      await request.post('/api/v1/auth/signup')
        .send({ ...user, username: "x' OR '1'='1", email: 'other@example.com' })
        .expect(201);
    });
  });

  describe('POST /api/v1/auth/signin', () => {
    it('logs in with the right password', async () => {
      const res = await request.post('/api/v1/auth/signin')
        .send({ username: user.username, password: user.password })
        .expect(200);
      expect(res.body.status).to.equal('Success');
      expect(res.body.message).to.equal('successfull login');
      expect(res.body.data).to.include({ username: 'hnobi', email: 'hnobi09@yahoo.com' });
      expect(res.body.token).to.be.a('string');
    });

    it('rejects a wrong password', async () => {
      const res = await request.post('/api/v1/auth/signin')
        .send({ username: user.username, password: 'not-the-password' })
        .expect(400);
      expect(res.body.message).to.equal('invalid username or password');
    });

    it('rejects an unknown user', async () => {
      const res = await request.post('/api/v1/auth/signin')
        .send({ username: 'wronguser', password: '12345678' })
        .expect(400);
      expect(res.body).to.deep.equal({ status: 'Failed', message: 'invalid username or password' });
    });

    it('cannot be bypassed with SQL injection', async () => {
      await request.post('/api/v1/auth/signin')
        .send({ username: "hnobi' --", password: 'anything' })
        .expect(400);
    });

    it('returns 400 when fields are missing', async () => {
      const res = await request.post('/api/v1/auth/signin').send({}).expect(400);
      expect(res.body).to.deep.equal({ message: 'All or some of the field is/are undefined' });
    });

    it('returns 400 when fields are empty or too short', async () => {
      const empty = await request.post('/api/v1/auth/signin')
        .send({ username: '', password: '' }).expect(400);
      expect(empty.body.errors).to.deep.equal({
        username: 'username  is required',
        password: 'password  is required'
      });

      const short = await request.post('/api/v1/auth/signin')
        .send({ username: 'h', password: 'dddd' }).expect(400);
      expect(short.body.errors).to.deep.equal({
        username: 'username must be between 2 to 100 characters'
      });
    });
  });

  describe('token handling', () => {
    it('returns 403 with no token', async () => {
      const res = await request.get('/api/v1/entries').expect(403);
      expect(res.body.message).to.equal('wrong token. provide  a valid token');
    });

    it('returns 401 with an invalid token', async () => {
      const res = await request.get('/api/v1/entries')
        .set('x-access-token', 'dshjjjsjwsjsnsnsnsnsnsns')
        .expect(401);
      expect(res.body.message).to.equal('Authentication failed. Token is either invalid or expired');
    });

    it('accepts the token as x-access-token, Bearer header or ?token=', async () => {
      const { body } = await request.post('/api/v1/auth/signin')
        .send({ username: user.username, password: user.password });
      await request.get('/api/v1/entries').set('x-access-token', body.token).expect(200);
      await request.get('/api/v1/entries').set('Authorization', `Bearer ${body.token}`).expect(200);
      await request.get(`/api/v1/entries?token=${body.token}`).expect(200);
    });
  });
});
