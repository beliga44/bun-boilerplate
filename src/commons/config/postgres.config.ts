export default {
    PG_HOST: process.env.PG_HOST || 'localhost',
    PG_PORT: +process.env.PG_PORT || 5432,
    PG_USERNAME: process.env.PG_USERNAME || 'macbook',
    PG_PASSWORD: process.env.PG_PASSWORD || '',
    PG_DATABASE: process.env.PG_DATABASE || 'postgres'
};
