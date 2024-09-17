import Elysia from 'elysia'
import { JwtAuth } from '../../commons/provider/jwtAuth'

export class AuthDerive {
    static async authenticateJwt(app: Elysia): Promise<object> {
        return app.derive(async ({ headers }) => {
            const user = await new JwtAuth().verify({ headers })

            return {
                user: user.data
            }
        })
    }
}
