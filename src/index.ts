import Elysia from 'elysia';
import appConfig from './commons/config/app.config';
import module from './modules/modules';
import * as mongoose from 'mongoose';
import { cors } from '@elysiajs/cors';
import 'reflect-metadata';
import { AppDataSource } from './commons/db/postgres';

let connection = null;

try {
    connection = await mongoose.connect(appConfig.MONGODB_URL);
} catch (e) {
    console.log(e);
}

await AppDataSource.initialize().catch((err) => {
    console.error(`Error connecting to DB: ${err.message}`);
});

console.log(`Database connected`);
const app = new Elysia()
    .use(cors())
    .use(module)
    .onError(({ error, code }) => {
        //Default route not found
        return {
            message: 'Not found',
            status: 404
        };
    })
    .listen(appConfig.PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const gracefulShutdown = async () => {
    console.log('Received shutdown signal, shutting down gracefully...');
    try {
        await app.stop();
        console.log('HTTP server closed');

        await AppDataSource.destroy();
        console.log('PostgreSQL pool closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown', err);
        process.exit(1);
    }
};

process.once('SIGINT', gracefulShutdown);
process.once('SIGTERM', gracefulShutdown);
process.once('beforeExit', gracefulShutdown);
