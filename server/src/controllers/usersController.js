import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { unlink } from 'node:fs/promises';
import db from '../models/db.js';
import config from '../config/env.js';
import { scheduleReminder } from '../services/reminders.js';
import { cloudinaryConfigured, uploadImage } from '../services/cloudinary.js';

const PUBLIC_USER_COLUMNS = 'id, fullname, username, email, image, reminder, createdat';

const signToken = user => jwt.sign(
  { fullname: user.fullname, username: user.username, userid: user.id },
  config.secretKey,
  { expiresIn: config.tokenExpiresIn }
);

export const signUp = async (req, res) => {
  const {
    fullname, username, email, password
  } = req.body;

  const existing = await db.query(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [email, username]
  );
  if (existing.rows.length > 0) {
    return res.status(409).json({ status: 'Failed', message: 'User already exist' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    `INSERT INTO users(fullname, username, email, password) VALUES ($1, $2, $3, $4)
     RETURNING ${PUBLIC_USER_COLUMNS}`,
    [fullname, username, email, hashedPassword]
  );
  const user = rows[0];

  return res.status(201).json({
    status: 'Success',
    message: 'Successfully created myDiary account',
    data: user,
    token: signToken(user)
  });
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;
  const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ status: 'Failed', message: 'invalid username or password' });
  }

  return res.status(200).json({
    status: 'Success',
    message: 'successfull login',
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image
    },
    token: signToken(user)
  });
};

export const userDetails = async (req, res) => {
  const { rows } = await db.query(
    `SELECT ${PUBLIC_USER_COLUMNS} FROM users WHERE id = $1`,
    [req.decoded.userid]
  );
  if (rows.length === 0) {
    return res.status(404).json({ status: 'Failed', message: 'User not found' });
  }
  const {
    id, fullname, username, email, image, reminder
  } = rows[0];
  return res.status(200).json({
    status: 'Success',
    message: 'successfull retrived user details',
    data: {
      id, fullname, username, email, image, reminder
    }
  });
};

/**
 * Updates any of fullname, username, email, reminder and password.
 * Fields that are not sent keep their current value; an empty password is ignored.
 */
export const updateUserProfile = async (req, res) => {
  const { userid } = req.decoded;
  const {
    fullname, username, email, reminder, password
  } = req.body;

  if ((email !== undefined) || (username !== undefined)) {
    const clash = await db.query(
      'SELECT id FROM users WHERE (email = $1 OR username = $2) AND id <> $3',
      [email ?? null, username ?? null, userid]
    );
    if (clash.rows.length > 0) {
      return res.status(409).json({ status: 'Failed', message: 'Username or email already in use' });
    }
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  const reminderDays = reminder === undefined || reminder === '' ? null : parseInt(reminder, 10);

  const { rows } = await db.query(
    `UPDATE users SET
       fullname = COALESCE($1, fullname),
       username = COALESCE($2, username),
       email = COALESCE($3, email),
       reminder = COALESCE($4, reminder),
       password = COALESCE($5, password)
     WHERE id = $6
     RETURNING ${PUBLIC_USER_COLUMNS}`,
    [fullname ?? null, username ?? null, email ?? null, reminderDays, hashedPassword, userid]
  );
  if (rows.length === 0) {
    return res.status(404).json({ status: 'Failed', message: 'User not found' });
  }
  const user = rows[0];

  scheduleReminder({
    userId: user.id, email: user.email, username: user.username, reminder: user.reminder
  });

  return res.status(200).json({
    status: 'Success',
    message: 'successfully modified your profile',
    userDetails: user
  });
};

export const updateImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'Failed', message: 'image file is required' });
  }
  try {
    if (!cloudinaryConfigured) {
      return res.status(503).json({
        status: 'Failed',
        message: 'Image upload is not configured on this server'
      });
    }
    const imageUrl = await uploadImage(req.file.path);
    const { rows } = await db.query(
      'UPDATE users SET image = $1 WHERE id = $2 RETURNING image',
      [imageUrl, req.decoded.userid]
    );
    return res.status(200).json({ status: 'Success', imageUrl: rows[0].image });
  } finally {
    await unlink(req.file.path).catch(() => {});
  }
};
