import {DataSource} from "typeorm";
import {User} from "../../modules/user/user.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "macbook",
    password: "",
    database: "evaluation",
    entities: [User],
    synchronize: true,
    logging: false,
});