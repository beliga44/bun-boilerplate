import { User } from '../user.entity';
import { AbstractDto } from '../../../commons/abstract.dto';
import { TodoDto } from '../../todo/dto/todo.dto';
import { UtilsService } from '../../../commons/utils.service';

export class UserDto extends AbstractDto {
    id: string;
    email: string;
    name: string;
    username: string;
    role: string;
    todos: TodoDto[] | null;

    constructor(t: User) {
        super(t);
        this.id = t.id.toString();
        this.email = t.email;
        this.role = t.role.toString();
        this.name = t.name;
        this.username = t.username;
        this.todos = t.todos && UtilsService.toDto(TodoDto, t.todos);
    }
}
