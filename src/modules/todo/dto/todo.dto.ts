import { AbstractDto } from '../../../commons/abstract.dto';
import { Todo } from '../todo.entity';
import { UserDto } from '../../user/dto/user.dto';
import { UtilsService } from '../../../commons/utils.service';

export class TodoDto extends AbstractDto {
    id: string;
    name: string;
    user: UserDto | null;

    constructor(t: Todo) {
        super(t);
        this.id = t.id.toString();
        this.name = t.name;
        this.user = t.user && UtilsService.toDto(UserDto, t.user);
    }
}
