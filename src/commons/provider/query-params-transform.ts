import { UtilsService } from '../utils.service';
import { QueryParamsDto } from '../dto/query-params.dto';

export const queryParamTransform = ({ query }) => {
    const queryDTO = UtilsService.toDto(QueryParamsDto, query);

    for (const queryDTOKey in queryDTO) {
        query[queryDTOKey] = queryDTO[queryDTOKey];
    }
};
