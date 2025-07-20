import postgresConfig from './postgres.config';

export default {
    PORT: process.env.PORT || 3000,
    HOST_URL: process.env.HOST_URL || 'http://localhost:3000',
    JWT_SECRET: process.env.JWT_SECRET || 'tell_no_secret',
    API_KEY: process.env.API_KEY,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/test',
    ...postgresConfig
};
