import Joi from 'joi';

export const updateTodoValidationJoi = Joi.object({
    id: Joi.string().guid().required(),
    name: Joi.string().optional()
});
