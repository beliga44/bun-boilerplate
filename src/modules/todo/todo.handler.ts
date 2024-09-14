import {CreateDto} from "./dto/create.dto";
import {TodoService} from "./todo.service";
import {UtilsService} from "../../commons/utils.service";
import {TodoDto} from "./dto/todo.dto";
import HttpException from "../../commons/dto/http-exception";

export class TodoHandler {
    private _service: TodoService;

    constructor(service: TodoService) {
        this._service = service;
    }

    async getTodos(): Promise<TodoDto[]> {
        return UtilsService.toDto(TodoDto, await this._service.getTodos());
    }

    async getTodoById(id: string): Promise<TodoDto> {
        const todo = await this._service.getTodoById(id);

        if (!todo) {
            throw new HttpException('Todo not found', 404);
        }

        return UtilsService.toDto(TodoDto, todo);
    }

    async createTodo(createDto: CreateDto): Promise<TodoDto> {
        return UtilsService.toDto(TodoDto, await this._service.createTodo(createDto));
    }
}