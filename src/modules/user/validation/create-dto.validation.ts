import Joi from 'joi';
import { UserRole } from '../../../commons/enum/role.enum';

export const createUserValidationJoi = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().required(),

    role: Joi.string().valid(Object.values(UserRole).join(',')).optional()
});
