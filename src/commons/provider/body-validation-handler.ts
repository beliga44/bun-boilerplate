import HttpException from '../dto/http-exception';
import Joi from 'joi';

export const bodyValidationHandler = (
    body: object,
    validator: Joi.ObjectSchema
) => {
    const { value, error } = validator.validate(body, {
        abortEarly: false
    });
    if (error?.message) {
        throw new HttpException(error.message, 400);
    }
};
