import Elysia from 'elysia';
import { TodoHandler } from './todo.handler';
import createDtoValidation from './validation/create-dto.validation';
import { TodoService } from './todo.service';
import { JwtAuth } from '../../commons/provider/jwtAuth';
import HttpException from '../../commons/dto/http-exception';
import { createTodoValidationJoi } from './validation/create-dto.validation.joi';

export default new Elysia({ prefix: '/todos' })
    .onBeforeHandle(async (context) => await new JwtAuth().verify(context))
    .decorate({
        Handler: new TodoHandler(new TodoService())
    })
    .get('/', ({ Handler }: { Handler: TodoHandler }) => Handler.getTodos())
    .get('/:id', ({ Handler, params: { id } }: { Handler: TodoHandler }) =>
        Handler.getTodoById(id)
    )
    .post(
        '/',
        ({ Handler, body }: { Handler: TodoHandler }) =>
            Handler.createTodo(body),
        {
            beforeHandle({ body }) {
                const { value, error } = createTodoValidationJoi.validate(
                    body,
                    {
                        abortEarly: false
                    }
                );
                if (error?.message) {
                    throw new HttpException(error.message, 400);
                }
            }
        }
    );
