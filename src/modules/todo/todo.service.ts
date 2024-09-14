import {Todo, TodoModel} from "./todo.entity";
import {CreateDto} from "./dto/create.dto";

export class TodoService {

    async getTodos(): Promise<Todo[]> {
        return TodoModel.find({}).exec();
    }

    async getTodoById(id: string): Promise<Todo> {
        return await TodoModel.findOne({
            _id: id
        }).exec() as Todo;
    }

    async createTodo(createDto: CreateDto): Promise<Todo> {
        return await TodoModel.create({
            name: createDto.name
        });
    }
}