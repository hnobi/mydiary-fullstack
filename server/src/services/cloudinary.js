import { v2 as cloudinary } from 'cloudinary';
import config from '../config/env.js';

const { cloudName, apiKey, apiSecret } = config.cloudinary;

export const cloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Uploads a local file to Cloudinary.
 * @param {string} filePath
 * @returns {Promise<string>} the hosted image URL
 */
export const uploadImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, { folder: 'mydiary' });
  return result.secure_url;
};
