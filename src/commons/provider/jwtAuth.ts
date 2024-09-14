import jwt from 'jsonwebtoken'
import appConfig from '../config/app.config'
import HttpException from '../dto/http-exception'
import Elysia, { Handler } from 'elysia'

export class JwtAuth {
    async verify({ headers, request }: Elysia): Promise<void> {
        const auth = headers['authorization']
        const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null

        const user = new Promise((resolve, reject) => {
            jwt.verify(token, appConfig.JWT_SECRET, (err, user) => {
                if (err) {
                    throw new HttpException('Unauthorized', 401)
                }

                resolve(user)
            })
        })

        request.user = await user
    }
}
