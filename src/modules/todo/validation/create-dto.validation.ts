import Joi from 'joi';

export const createTodoValidationJoi = Joi.object({
    id: Joi.string().guid().optional(),

    name: Joi.string().required()
});
