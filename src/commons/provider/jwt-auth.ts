import jwt from 'jsonwebtoken';
import appConfig from '../config/app.config';
import HttpException from '../dto/http-exception';
import Elysia from 'elysia';

export class JwtAuth {
    async verify({ headers }: Elysia): Promise<Object> {
        const auth: string = headers['authorization'];
        const token: string | null = auth?.startsWith('Bearer ')
            ? auth.slice(7)
            : null;

        if (!token) {
            throw new HttpException('Unauthorized', 401);
        }

        const user: Promise<Object> = new Promise((resolve, reject) => {
            jwt.verify(token, appConfig.JWT_SECRET, (err, user) => {
                if (err || !user) {
                    throw new HttpException('Unauthorized', 401);
                }

                resolve(user);
            });
        });

        return await user;
    }

    async sign(body: any): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(
                {
                    data: body,
                    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60 // 12 Hours expired
                },
                appConfig.JWT_SECRET,
                (err: Error | null, token: string | undefined) => {
                    if (err) {
                        throw new HttpException(err.message, 500);
                    }

                    if (!token) {
                        throw new HttpException(
                            'Error generating JWT token',
                            500
                        );
                    }

                    resolve(token);
                }
            );
        });
    }
}
