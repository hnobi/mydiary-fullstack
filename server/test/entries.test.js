import { expect } from 'chai';
import { request, createUser, createEntry } from './helpers.js';

describe('Entries', () => {
  let token;
  let otherToken;

  before(async () => {
    ({ token } = await createUser());
    ({ token: otherToken } = await createUser());
  });

  const auth = req => req.set('x-access-token', token);

  describe('POST /api/v1/entries', () => {
    it('adds an entry and returns it', async () => {
      const res = await auth(request.post('/api/v1/entries'))
        .send({
          title: 'black panther party',
          date: '2018-09-10',
          entry: 'Reflection describes a real or imaginary scene, event, interaction'
        })
        .expect(201);
      expect(res.body.status).to.equal('Success');
      expect(res.body.message).to.equal('Successfully added new entry');
      expect(res.body.data).to.include({ title: 'black panther party' });
      expect(res.body.data.id).to.be.a('number');
    });

    it('defaults the date to now when none is sent', async () => {
      const res = await auth(request.post('/api/v1/entries'))
        .send({ title: 'no date given', entry: 'an entry with no date at all' })
        .expect(201);
      expect(new Date(res.body.data.date).getFullYear()).to.equal(new Date().getFullYear());
    });

    it('returns 409 when the same user reuses a title', async () => {
      const res = await auth(request.post('/api/v1/entries'))
        .send({ title: 'black panther party', entry: 'a different entry body text' })
        .expect(409);
      expect(res.body.message).to.equal('title of entry already exist ');
    });

    it('lets a different user use the same title', async () => {
      await request.post('/api/v1/entries')
        .set('x-access-token', otherToken)
        .send({ title: 'black panther party', entry: 'someone else wrote this one' })
        .expect(201);
    });

    it('returns 400 for numbers in the title and a short entry', async () => {
      const res = await auth(request.post('/api/v1/entries'))
        .send({ title: '3rd holiday', entry: 'very fun' })
        .expect(400);
      expect(res.body.errors).to.deep.equal({
        title: 'Entry title must not contain numbers',
        entry: 'Diary entry provided must be between 10 to 500 characters'
      });
    });

    it('returns 400 for empty fields', async () => {
      const res = await auth(request.post('/api/v1/entries'))
        .send({ title: '', date: '', entry: '' })
        .expect(400);
      expect(res.body.errors).to.deep.equal({
        title: 'Title of entry is required',
        entry: 'Diary entry is required'
      });
    });

    it('returns 400 when fields are missing', async () => {
      const res = await auth(request.post('/api/v1/entries')).send({}).expect(400);
      expect(res.body).to.deep.equal({ message: 'All or some of the field is/are undefined' });
    });
  });

  describe('GET /api/v1/entries', () => {
    it('returns an empty list (not an error) for a new user', async () => {
      const { token: freshToken } = await createUser();
      const res = await request.get('/api/v1/entries').set('x-access-token', freshToken).expect(200);
      expect(res.body.status).to.equal('Success');
      expect(res.body.entries).to.deep.equal([]);
    });

    it("returns only the signed-in user's entries", async () => {
      const res = await auth(request.get('/api/v1/entries')).expect(200);
      expect(res.body.entries).to.have.length(2);
      const titles = res.body.entries.map(e => e.title);
      expect(titles).to.have.members(['black panther party', 'no date given']);
    });
  });

  describe('GET /api/v1/entries/:entryId', () => {
    let entry;
    before(async () => { entry = await createEntry(token, { title: 'single view' }); });

    it('returns the entry', async () => {
      const res = await auth(request.get(`/api/v1/entries/${entry.id}`)).expect(200);
      expect(res.body.message).to.equal('Successfully retrieve an entry');
      expect(res.body.data).to.include({ id: entry.id, title: 'single view' });
    });

    it("returns 404 for another user's entry", async () => {
      await request.get(`/api/v1/entries/${entry.id}`).set('x-access-token', otherToken).expect(404);
    });

    it('returns 404 for an unknown or non-numeric id', async () => {
      const res = await auth(request.get('/api/v1/entries/999999')).expect(404);
      expect(res.body).to.deep.equal({ status: 'Failed', message: 'Entry not found' });
      await auth(request.get('/api/v1/entries/abc')).expect(404);
    });
  });

  describe('PUT /api/v1/entries/:entryId', () => {
    let entry;
    before(async () => { entry = await createEntry(token, { title: 'before edit' }); });

    it('updates the entry', async () => {
      const res = await auth(request.put(`/api/v1/entries/${entry.id}`))
        .send({ title: 'after edit', date: '2018-10-10', entry: 'the updated body of the entry' })
        .expect(200);
      expect(res.body.message).to.equal('Successfully updated  your entry');
      expect(res.body.data).to.include({ title: 'after edit', entry: 'the updated body of the entry' });
    });

    it("cannot update another user's entry", async () => {
      await request.put(`/api/v1/entries/${entry.id}`)
        .set('x-access-token', otherToken)
        .send({ title: 'hijacked', date: '2018-10-10', entry: 'this should not be saved' })
        .expect(404);
      const res = await auth(request.get(`/api/v1/entries/${entry.id}`)).expect(200);
      expect(res.body.data.title).to.equal('after edit');
    });

    it('returns 400 for invalid fields', async () => {
      const res = await auth(request.put(`/api/v1/entries/${entry.id}`))
        .send({ title: '3rd holiday', entry: 'very fun', date: '2018-10-04' })
        .expect(400);
      expect(res.body.errors).to.deep.equal({
        title: 'Entry title must not contain numbers',
        entry: 'Diary entry provided must be between 10 to 500 characters'
      });
    });

    it('returns 404 for an unknown id', async () => {
      const res = await auth(request.put('/api/v1/entries/999999'))
        .send({ title: 'june holiday', date: '2018-08-09', entry: 'very fun and infomative' })
        .expect(404);
      expect(res.body).to.deep.equal({ status: 'Failed', message: 'entry id does not exist' });
    });
  });

  describe('GET /api/v1/entries/search', () => {
    before(async () => {
      await createEntry(token, { title: 'beach trip', entry: 'sand, sun and a long swim' });
      await createEntry(otherToken, { title: 'beach secrets', entry: 'not for anyone else to read' });
    });

    it('finds matches in title or body, case-insensitively', async () => {
      const res = await auth(request.get('/api/v1/entries/search?entry=BEACH')).expect(200);
      expect(res.body.data.map(e => e.title)).to.deep.equal(['beach trip']);
      const body = await auth(request.get('/api/v1/entries/search?entry=swim')).expect(200);
      expect(body.body.data.map(e => e.title)).to.deep.equal(['beach trip']);
    });

    it("never returns another user's entries", async () => {
      const res = await auth(request.get('/api/v1/entries/search?entry=secrets')).expect(404);
      expect(res.body.message).to.equal('Entry title not found');
    });

    it('treats SQL and wildcards in the term as plain text', async () => {
      await auth(request.get(`/api/v1/entries/search?entry=${encodeURIComponent("' OR '1'='1")}`)).expect(404);
      await auth(request.get('/api/v1/entries/search?entry=%25')).expect(404);
    });

    it('returns 400 for an empty term', async () => {
      await auth(request.get('/api/v1/entries/search?entry=')).expect(400);
    });
  });

  describe('DELETE /api/v1/entries/:entryId', () => {
    let entry;
    before(async () => { entry = await createEntry(token, { title: 'to delete' }); });

    it("cannot delete another user's entry", async () => {
      await request.delete(`/api/v1/entries/${entry.id}`).set('x-access-token', otherToken).expect(404);
    });

    it('deletes the entry', async () => {
      const res = await auth(request.delete(`/api/v1/entries/${entry.id}`)).expect(200);
      expect(res.body).to.deep.equal({ status: 'Success', message: 'Successfully deleted entry' });
      await auth(request.get(`/api/v1/entries/${entry.id}`)).expect(404);
    });

    it('returns 404 when the entry no longer exists', async () => {
      const res = await auth(request.delete(`/api/v1/entries/${entry.id}`)).expect(404);
      expect(res.body).to.deep.equal({ status: 'Failed', message: 'entry id does not exist' });
    });
  });
});
