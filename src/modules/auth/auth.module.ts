import { container } from '../container';
import Elysia from 'elysia';
import { queryParamTransform } from '../../commons/provider/query-params-transform';
import { bodyValidationHandler } from '../../commons/provider/body-validation-handler';
import { AuthService } from './auth.service';
import { AuthHandler } from './auth.handler';
import { loginValidationJoi } from './validation/login-dto.validation';

export default new Elysia({ prefix: '/auth' })
    .decorate({
        authHandler: new AuthHandler(container.resolve(AuthService))
    })
    .post(
        '/login',
        ({ authHandler, body }: { authHandler: AuthHandler; body: any }) =>
            authHandler.login(body),
        {
            beforeHandle({ body }: { body: any }) {
                bodyValidationHandler(body, loginValidationJoi);
            }
        }
    );
