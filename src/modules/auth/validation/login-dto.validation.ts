import Joi from 'joi';

export const loginValidationJoi = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().required()
});
