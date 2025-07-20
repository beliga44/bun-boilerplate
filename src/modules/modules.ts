import Elysia from 'elysia';
import { ResponseDto } from '../commons/dto/response.dto';
import UserModule from './user/user.module';
import AuthModule from './auth/auth.module';
import TodoModule from './todo/todo.module';

export default new Elysia()
    .onAfterHandle((response) => {
        return JSON.parse(JSON.stringify(new ResponseDto(response)));
    })
    .onError(({ error, request, set, code }) => {
        if (code === 'VALIDATION') {
            set.status = 400;
            const errors = error.all.map((x) => {
                return {
                    property: x.path.replace('/', ''),
                    error: x.message
                };
            });
            return {
                message: errors,
                status: 400
            };
        }

        return {
            message: error.message,
            status: set?.status || 500
        };
    })
    .onTransform(function log({ body, params, path, request: { method } }) {
        console.log(`${new Date()} ${method} ${path}`, { params });
    })
    .use(UserModule)
    .use(AuthModule)
    .use(TodoModule);
