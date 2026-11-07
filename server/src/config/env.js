import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';

const databaseUrl = nodeEnv === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    `Missing database URL: set ${nodeEnv === 'test' ? 'TEST_DATABASE_URL' : 'DATABASE_URL'} (see .env.example)`
  );
}

if (!process.env.SECRET_KEY) {
  throw new Error('Missing SECRET_KEY (see .env.example)');
}

const config = {
  nodeEnv,
  port: parseInt(process.env.PORT, 10) || 3000,
  databaseUrl,
  // Managed Postgres (RDS, Neon, Render...) needs SSL; the local Docker database does not.
  databaseSsl: process.env.DB_SSL === 'true',
  secretKey: process.env.SECRET_KEY,
  tokenExpiresIn: '10h',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  mail: {
    service: process.env.MAIL_SERVICE || 'gmail',
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8080',
};

export default config;
