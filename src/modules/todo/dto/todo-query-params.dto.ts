import { QueryParamsDto } from '../../../commons/dto/query-params.dto';

export class TodoQueryParamsDto extends QueryParamsDto {
    name: string;
    userId: string;
}
