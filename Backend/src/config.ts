import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const config = {
  port: process.env.PORT || 8000,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiryMS: 1000000 ,
    refreshTokenExpiryMS: 21600000,
  },
  database: {
    client: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
  frontendUrl: process.env.FRONTEND_URL,
};

export default config;
