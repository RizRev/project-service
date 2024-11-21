// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import confidence from "confidence";

let minioSSL: boolean | string | undefined;
minioSSL = process.env.MINIO_SSL;
if (minioSSL == "true" || minioSSL == "TRUE") {
  minioSSL = true;
} else {
  minioSSL = false;
}

const config = {
  port: process.env.PORT,
  jwtKey: process.env.JWT_KEY,
  cryptIV: process.env.CRYPT_IV,
  cryptKey: process.env.CRYPT_KEY,
  pgsqlConfig: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  },
  redisConfig: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_AUTH
  },
  ssoConfig: {
    baseURL: process.env.SSO_BASE_URL,
    basicUsername: process.env.SSO_BASIC_USERNAME,
    basicPassword: process.env.SSO_BASIC_PASSWORD,
    redirectUri: process.env.SSO_REDIRECT_URI
  },
  minioBucket: process.env.MINIO_BUCKET,
  minioConfig: {
    endPoint: process.env.MINIO_SERVER,
    useSSL: minioSSL,
    accessKey: process.env.MINIO_ID,
    secretKey: process.env.MINIO_KEY
  }
};

const store = new confidence.Store(config);
export const globalConfig = (key: any) => store.get(key);
