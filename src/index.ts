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

AppDataSource.initialize()
    .then(() => {
        console.log(`Database connected`);
    })
    .catch((error) => console.log(error));

const app = new Elysia()
    .use(cors())
    .use(module)
    .get('/', () => 'Hello Elysia')
    .listen(appConfig.PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

process.on('SIGINT', async () => {
    await connection.disconnect();
    console.log('EXIT');
    process.exit(0);
});
