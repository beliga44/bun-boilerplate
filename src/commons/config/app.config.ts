export default {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'tell_no_secret',
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/test'
};
