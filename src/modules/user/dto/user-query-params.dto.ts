import { QueryParamsDto } from '../../../commons/dto/query-params.dto';
import { UserRole } from '../../../commons/enum/role.enum';

export class UserQueryParamsDto extends QueryParamsDto {
    role: UserRole;
}
