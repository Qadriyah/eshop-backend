import 'dotenv/config';

export default {
  MONGO_URL: process.env.MONGO_URL as string,
  MONGO_TEST_URL: process.env.MONGO_TEST_URL as string,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  CLIENT_ID: process.env.CLIENT_ID as string,
  CLIENT_SECRET: process.env.CLIENT_SECRET as string,
  REDIRECT_URL: process.env.REDIRECT_URL as string,
  REDIRECT_FRONTEND_URL: process.env.REDIRECT_FRONTEND_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_TTL: process.env.JWT_TTL as string,
  NODE_ENV: process.env.NODE_ENV as string,
};
