import Elysia from 'elysia';
import { JwtAuth } from '../../commons/provider/jwt-auth';
import appConfig from '../../commons/config/app.config';
import HttpException from '../../commons/dto/http-exception';

export class AuthDerive {
    static async authenticateJwt(app: Elysia): Promise<Object> {
        return app.derive(async ({ headers }) => {
            const user = await new JwtAuth().verify({ headers });

            return {
                user: user.data
            };
        });
    }

    static async authenticateJwtOrApiKey(app: Elysia): Promise<Object> {
        return app.derive(async ({ headers }) => {
            const apiKey: string = headers['x-api-key'];

            if (apiKey) {
                if (apiKey !== appConfig.API_KEY) {
                    throw new HttpException('Unauthorized', 401);
                }

                return {
                    user: {}
                };
            }

            const user = await new JwtAuth().verify({ headers });

            return {
                user: user.data
            };
        });
    }
}
