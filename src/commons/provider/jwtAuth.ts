import jwt from 'jsonwebtoken'
import appConfig from '../config/app.config'
import HttpException from '../dto/http-exception'
import Elysia from 'elysia'

export class JwtAuth {
    async verify({ headers }: Elysia): Promise<void> {
        const auth: string = headers['authorization']
        const token: string | null = auth?.startsWith('Bearer ')
            ? auth.slice(7)
            : null

        const user = new Promise((resolve, reject) => {
            jwt.verify(token, appConfig.JWT_SECRET, (err, user) => {
                if (err) {
                    throw new HttpException('Unauthorized', 401)
                }

                resolve(user)
            })
        })

        return await user
    }

    async sign(body: any): Promise<string> {
        const token = new Promise((resolve, reject) => {
            jwt.sign(
                {
                    data: body,
                    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60 // 12 Hours expired
                },
                appConfig.JWT_SECRET,
                (err, token) => {
                    if (err) {
                        throw new HttpException(err.message, 500)
                    }

                    resolve(token)
                }
            )
        })

        return await token
    }
}
