import Elysia from 'elysia';
import { TodoHandler } from './todo.handler';
import { createTodoValidationJoi } from './validation/create-dto.validation';
import { TodoService } from './todo.service';
import { queryParamTransform } from '../../commons/provider/query-params-transform';
import { bodyValidationHandler } from '../../commons/provider/body-validation-handler';
import { updateTodoValidationJoi } from './validation/update-dto.validation';
import { AuthDerive } from '../auth/auth.derive';
import { UpdateTodoWorker } from './queue-job/update-todo.worker';
import redisConfig from '../../commons/config/redis.config';
import { container } from '../container';
import { QueueJobName } from '../../commons/enum/queue-job-name';
import Joi from 'joi';

const todoService = container.resolve(TodoService);

export default new Elysia({ prefix: '/todos' })
    .use(AuthDerive.authenticateJwtOrApiKey)
    .decorate({
        todoHandler: new TodoHandler(todoService),
        updateTodoWorker: new UpdateTodoWorker(
            QueueJobName.UPDATE_TODO.toString(),
            {
                host: redisConfig.REDIS_HOST,
                port: redisConfig.REDIS_PORT
            },
            todoService
        )
    })
    .get(
        '/',
        ({ todoHandler, query }: { todoHandler: TodoHandler }) =>
            todoHandler.getTodos(query),
        {
            transform: queryParamTransform
        }
    )
    .get(
        '/:id',
        ({ todoHandler, params: { id } }: { todoHandler: TodoHandler }) =>
            todoHandler.getTodoById(id),
        {
            beforeHandle({ params }) {
                bodyValidationHandler(
                    params,
                    Joi.object({
                        id: Joi.string().guid().required()
                    })
                );
            }
        }
    )
    .post(
        '/',
        ({ todoHandler, body, user }: { todoHandler: TodoHandler }) =>
            todoHandler.createTodo(body, user),
        {
            beforeHandle({ body }) {
                bodyValidationHandler(body, createTodoValidationJoi);
            }
        }
    )
    .put(
        '/:id',
        ({ todoHandler, params: { id }, body }: { todoHandler: TodoHandler }) =>
            todoHandler.updateTodo(id, body),
        {
            beforeHandle({ body, params }) {
                const merge = { ...body, ...params };
                bodyValidationHandler(merge, updateTodoValidationJoi);
            }
        }
    )
    .delete(
        '/:id',
        ({ todoHandler, params: { id } }: { todoHandler: TodoHandler }) =>
            todoHandler.deleteTodo(id),
        {
            beforeHandle({ params }) {
                bodyValidationHandler(
                    params,
                    Joi.object({
                        id: Joi.string().guid().required()
                    })
                );
            }
        }
    );
