import { CreateDto } from './dto/create.dto';
import { TodoService } from './todo.service';
import { UtilsService } from '../../commons/utils.service';
import HttpException from '../../commons/dto/http-exception';
import { TodoDto } from './dto/todo.dto';
import { UpdateDto } from './dto/update.dto';
import { TodoQueryParamsDto } from './dto/todo-query-params.dto';
import { Pagination } from '../../commons/provider/paginate.service';
import { NotFoundError } from '../../commons/error/not-found.error';
import { error } from 'elysia';

export class TodoHandler {
    private todoService: TodoService;

    constructor(service: TodoService) {
        this.todoService = service;
    }

    async getTodos(query: TodoQueryParamsDto): Promise<Pagination<TodoDto>> {
        return await this.todoService.getTodos(query);
    }

    async getTodoById(id: string): Promise<TodoDto> {
        const todo = await this.todoService.getTodoById(id);

        if (!todo) {
            throw new HttpException('Todo not found', 404);
        }

        return UtilsService.toDto(TodoDto, todo);
    }

    async createTodo(createDto: CreateDto, user: any): Promise<TodoDto> {
        try {
            return UtilsService.toDto(
                TodoDto,
                await this.todoService.createTodo(createDto, user)
            );
        } catch (e) {
            if (e instanceof NotFoundError) {
                throw new HttpException(e.message, 404);
            }
            throw e;
        }
    }

    async updateTodo(id: string, updateDto: UpdateDto): Promise<TodoDto> {
        return UtilsService.toDto(
            TodoDto,
            await this.todoService.updateTodo(id, updateDto)
        );
    }

    async deleteTodo(id: string): Promise<void> {
        const todo = await this.todoService.getTodoById(id);

        if (!todo) {
            throw new HttpException('Todo not found', 404);
        }

        await this.todoService.deleteTodo(id);
    }
}
