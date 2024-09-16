import Elysia from 'elysia';
import { UserHandler } from './user.handler';
import { createUserValidationJoi } from './validation/create-dto.validation';
import { UserService } from './user.service';
import { JwtAuth } from '../../commons/provider/jwtAuth';
import { queryParamTransform } from '../../commons/provider/query-params-transform';
import { bodyValidationHandler } from '../../commons/provider/body-validation-handler';
import { updateUserValidationJoi } from './validation/update-dto.validation';

export default new Elysia({ prefix: '/users' })
    .onBeforeHandle(async (context) => await new JwtAuth().verify(context))
    .decorate({
        Handler: new UserHandler(new UserService())
    })
    .get(
        '/',
        ({ Handler, query }: { Handler: UserHandler }) =>
            Handler.getUsers(query),
        {
            transform: queryParamTransform
        }
    )
    .get('/:id', ({ Handler, params: { id } }: { Handler: UserHandler }) =>
        Handler.getUserById(id)
    )
    .post(
        '/',
        ({ Handler, body }: { Handler: UserHandler }) =>
            Handler.createUser(body),
        {
            beforeHandle({ body }) {
                bodyValidationHandler(body, createUserValidationJoi);
            }
        }
    )
    .put(
        '/:id',
        ({ Handler, params: { id }, body }: { Handler: UserHandler }) =>
            Handler.updateUser(id, body),
        {
            beforeHandle({ body }) {
                bodyValidationHandler(body, updateUserValidationJoi);
            }
        }
    );
