import 'reflect-metadata';

import { container } from 'tsyringe';
import { RedisService } from '../commons/provider/redis.service';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { PaginateService } from '../commons/provider/paginate.service';
import { TodoService } from './todo/todo.service';

container.registerSingleton(RedisService);
container.registerSingleton(PaginateService);

container.register(AuthService, { useClass: AuthService });
container.register(UserService, { useClass: UserService });
container.register(TodoService, { useClass: TodoService });

export { container };
