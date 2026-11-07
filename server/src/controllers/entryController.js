import db from '../models/db.js';

const entryDate = date => date || new Date();

export const addEntry = async (req, res) => {
  const { title, entry } = req.body;
  const date = entryDate(req.body.date);
  const { userid } = req.decoded;

  const existing = await db.query(
    'SELECT id FROM entries WHERE userid = $1 AND title = $2',
    [userid, title]
  );
  if (existing.rows.length > 0) {
    return res.status(409).json({ status: 'Failed', message: 'title of entry already exist ' });
  }

  const { rows } = await db.query(
    'INSERT INTO entries(title, date, entry, userid) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, date, entry, userid]
  );
  return res.status(201).json({
    status: 'Success',
    message: 'Successfully added new entry',
    data: rows[0]
  });
};

export const modifyEntry = async (req, res) => {
  const { title, entry } = req.body;
  const date = entryDate(req.body.date);
  const { entryId } = req.params;

  const { rows, rowCount } = await db.query(
    `UPDATE entries SET title = $1, date = $2, entry = $3
     WHERE id = $4 AND userid = $5 RETURNING *`,
    [title, date, entry, entryId, req.decoded.userid]
  );
  if (rowCount === 0) {
    return res.status(404).json({ status: 'Failed', message: 'entry id does not exist' });
  }
  return res.status(200).json({
    status: 'Success',
    message: 'Successfully updated  your entry',
    data: rows[0]
  });
};

export const getAllEntry = async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM entries WHERE userid = $1 ORDER BY date DESC, id DESC',
    [req.decoded.userid]
  );
  return res.status(200).json({
    status: 'Success',
    message: rows.length === 0
      ? 'No entry in your diary'
      : `Successsfully retrieved all diary entries with total of ${rows.length} entries`,
    entries: rows
  });
};

export const getEntry = async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM entries WHERE userid = $1 AND id = $2',
    [req.decoded.userid, req.params.entryId]
  );
  if (rows.length === 0) {
    return res.status(404).json({ status: 'Failed', message: 'Entry not found' });
  }
  return res.status(200).json({
    status: 'Success',
    message: 'Successfully retrieve an entry',
    data: rows[0]
  });
};

export const deleteEntry = async (req, res) => {
  const { rowCount } = await db.query(
    'DELETE FROM entries WHERE userid = $1 AND id = $2',
    [req.decoded.userid, req.params.entryId]
  );
  if (rowCount === 0) {
    return res.status(404).json({ status: 'Failed', message: 'entry id does not exist' });
  }
  return res.status(200).json({ status: 'Success', message: 'Successfully deleted entry' });
};

/**
 * GET /entries/search?entry=<text> — case-insensitive match on title or body,
 * limited to the signed-in user's entries.
 */
export const searchEntry = async (req, res) => {
  const term = String(req.query.entry ?? '').trim();
  if (!term) {
    return res.status(400).json({ status: 'Failed', message: 'search term is required' });
  }
  const pattern = `%${term.replace(/[\\%_]/g, '\\$&')}%`;
  const { rows } = await db.query(
    `SELECT * FROM entries
     WHERE userid = $1 AND (entry ILIKE $2 OR title ILIKE $2)
     ORDER BY date DESC, id DESC`,
    [req.decoded.userid, pattern]
  );
  if (rows.length === 0) {
    return res.status(404).json({ status: 'Failed', message: 'Entry title not found' });
  }
  return res.status(200).json({
    status: 'Success',
    message: 'Successfully retrieve an entry',
    data: rows
  });
};
