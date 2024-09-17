import Elysia from 'elysia';
import { JwtAuth } from '../../commons/provider/jwtAuth';
import { queryParamTransform } from '../../commons/provider/query-params-transform';
import { bodyValidationHandler } from '../../commons/provider/body-validation-handler';
import { AuthService } from './auth.service';
import { AuthHandler } from './auth.handler';
import { loginValidationJoi } from './validation/login-dto.validation';
import { AuthDerive } from './auth.derive';

export default new Elysia({ prefix: '/auth' })
    .decorate({
        authHandler: new AuthHandler(new AuthService())
    })
    .post(
        '/login',
        ({ authHandler, body }: { authHandler: AuthHandler }) =>
            authHandler.login(body),
        {
            beforeHandle({ body }) {
                bodyValidationHandler(body, loginValidationJoi);
            }
        }
    )
    .use(AuthDerive.authenticateJwt)
    .get(
        '/me',
        ({ authHandler, query, user }: { authHandler: AuthHandler }) => user,
        {
            transform: queryParamTransform
        }
    );
