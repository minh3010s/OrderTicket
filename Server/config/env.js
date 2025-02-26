const { config } = require("dotenv");

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });


const Path = {
  PORT: process.env.PORT || 1010,
  NODE_ENV: process.env.NODE_ENV,
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/Project',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_ACCOUNT: process.env.EMAIL_ACCOUNT,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
};

module.exports = Path;

