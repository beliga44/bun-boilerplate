import Joi from 'joi';

export const loginValidationJoi = Joi.object({
    email: Joi.string().required(),

    password: Joi.string().required(),

    captcha: Joi.string().optional(),

    captchaId: Joi.string().optional()
});
