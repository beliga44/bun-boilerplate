import { DataSource } from 'typeorm'
import { User } from '../../modules/user/user.entity'
import postgresConfig from '../config/postgres.config'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: postgresConfig.PG_HOST,
    port: postgresConfig.PG_PORT,
    username: postgresConfig.PG_USERNAME,
    password: postgresConfig.PG_PASSWORD,
    database: postgresConfig.PG_DATABASE,
    entities: [User],
    synchronize: true,
    logging: false
})
