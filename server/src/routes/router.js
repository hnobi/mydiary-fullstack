import express from 'express';
import multer from 'multer';
import os from 'node:os';
import * as entries from '../controllers/entryController.js';
import * as users from '../controllers/usersController.js';
import {
  addEntryValidation, modifyEntryValidation, entryIdParam
} from '../middlewares/entryValidation.js';
import {
  signUpValidation, signInValidation, updateProfileValidation
} from '../middlewares/userValidation.js';
import authToken from '../middlewares/authToken.js';

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
});

const router = express.Router();

// Auth
router.post('/auth/signup', signUpValidation, users.signUp);
router.post('/auth/signin', signInValidation, users.signIn);

// User profile
router.route('/user/details')
  .get(authToken, users.userDetails)
  .put(authToken, updateProfileValidation, users.updateUserProfile);
router.put('/user/upload', authToken, upload.single('image'), users.updateImage);

// Entries
router.route('/entries')
  .post(authToken, addEntryValidation, entries.addEntry)
  .get(authToken, entries.getAllEntry);
router.get('/entries/search', authToken, entries.searchEntry);
router.route('/entries/:entryId')
  .all(authToken, entryIdParam)
  .get(entries.getEntry)
  .put(modifyEntryValidation, entries.modifyEntry)
  .delete(entries.deleteEntry);

export default router;
