import Joi from 'joi';
import { UserRole } from '../../../commons/enum/role.enum';

export const updateUserValidationJoi = Joi.object({
    password: Joi.string().optional(),

    role: Joi.string().valid(Object.values(UserRole).join(',')).optional()
});
