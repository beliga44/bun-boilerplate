import Elysia from 'elysia'
import { UserHandler } from './user.handler'
import { createUserValidationJoi } from './validation/create-dto.validation'
import { UserService } from './user.service'
import { queryParamTransform } from '../../commons/provider/query-params-transform'
import { bodyValidationHandler } from '../../commons/provider/body-validation-handler'
import { updateUserValidationJoi } from './validation/update-dto.validation'
import { AuthDerive } from '../auth/auth.derive'

export default new Elysia({ prefix: '/users' })
    .use(AuthDerive.authenticateJwt)
    .decorate({
        userHandler: new UserHandler(new UserService())
    })
    .get(
        '/',
        ({ userHandler, query }: { userHandler: UserHandler }) =>
            userHandler.getUsers(query),
        {
            transform: queryParamTransform
        }
    )
    .get(
        '/:id',
        ({ userHandler, params: { id } }: { userHandler: UserHandler }) =>
            userHandler.getUserById(id)
    )
    .post(
        '/',
        ({ userHandler, body }: { userHandler: UserHandler }) =>
            userHandler.createUser(body),
        {
            beforeHandle({ body }) {
                bodyValidationHandler(body, createUserValidationJoi)
            }
        }
    )
    .put(
        '/:id',
        ({ userHandler, params: { id }, body }: { userHandler: UserHandler }) =>
            userHandler.updateUser(id, body),
        {
            beforeHandle({ body }) {
                bodyValidationHandler(body, updateUserValidationJoi)
            }
        }
    )
