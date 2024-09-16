import { Todo } from '../todo.entity';

export class TodoDto {
    id: string;
    name: string;
    description: string;

    constructor(t: Todo) {
        this.id = t._id.toString();
        this.name = t.name;
        this.description = t.description;
    }
}
