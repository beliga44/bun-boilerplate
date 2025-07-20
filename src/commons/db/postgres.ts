import { DataSource } from 'typeorm';
import { User } from '../../modules/user/user.entity';
import postgresConfig from '../config/postgres.config';
import redisConfig from '../config/redis.config';
import { Todo } from '../../modules/todo/todo.entity';

const dbEntities = [User, Todo];

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: postgresConfig.PG_HOST,
    port: postgresConfig.PG_PORT,
    username: postgresConfig.PG_USERNAME,
    password: postgresConfig.PG_PASSWORD,
    database: postgresConfig.PG_DATABASE,
    entities: dbEntities,
    synchronize: true,
    logging: false,
    cache: {
        type: 'redis',
        options: {
            host: redisConfig.REDIS_HOST,
            port: redisConfig.REDIS_PORT
        },
        duration: 30000
    }
});
