import { config as loadDotenv } from 'dotenv';
import convict from 'convict';
import convictFormatWithValidator from 'convict-format-with-validator';

loadDotenv();

convict.addFormats(convictFormatWithValidator);

export type AppSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
  MONGO_URI: string;
  UPLOAD_DIR: string;
};

export const appConfig = convict({
  PORT: {
    doc: 'Port on which the HTTP server will listen',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  DB_HOST: {
    doc: 'MongoDB host IP address',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'DB_HOST'
  },
  SALT: {
    doc: 'Random salt for hashing operations',
    format: String,
    default: '',
    env: 'SALT'
  },
  MONGO_URI: {
    doc: 'MongoDB connection URI',
    format: String,
    default: 'mongodb://127.0.0.1:27017/six-cities',
    env: 'MONGO_URI',
  },
  UPLOAD_DIR: {
    doc: 'Filesystem path for storing user-uploaded files',
    format: String,
    default: './uploads',
    env: 'UPLOAD_DIR',
  },
});

appConfig.validate({ allowed: 'strict' });
