import { Todo } from './todo.entity';
import { AppDataSource } from '../../commons/db/postgres';
import { Brackets, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UtilsService } from '../../commons/utils.service';
import { UpdateDto } from './dto/update.dto';
import {
    PaginateService,
    Pagination
} from '../../commons/provider/paginate.service';
import { TodoDto } from './dto/todo.dto';
import { TodoQueryParamsDto } from './dto/todo-query-params.dto';
import { inject, injectable } from 'tsyringe';
import HttpException from '../../commons/dto/http-exception';
import { UserService } from '../user/user.service';
import { NotFoundError } from '../../commons/error/not-found.error';
import { QueueJob } from '../../commons/provider/queue.job';
import { QueueJobName } from '../../commons/enum/queue-job-name';

@injectable()
export class TodoService {
    private todoRepository: Repository<Todo>;
    private paginateService: PaginateService;
    private userService: UserService;

    constructor(
        @inject(UserService) userService: UserService,
        @inject(PaginateService) paginateService: PaginateService
    ) {
        this.todoRepository = AppDataSource.getRepository(Todo);
        this.paginateService = paginateService;
        this.userService = userService;
    }

    async getTodos(query: TodoQueryParamsDto): Promise<Pagination<TodoDto>> {
        const todos = this.todoRepository
            .createQueryBuilder('todo')
            .leftJoinAndSelect('todo.user', 'user');

        if (query.userId) {
            todos.andWhere('todo.userId = :userId', {
                userId: query.userId
            });
        }

        if (query.search) {
            todos.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('todo.name ILIKE :q', {
                        q: `%${query.search}%`
                    });
                })
            );
        }

        return this.paginateService.paginateQueryBuilder<Todo, TodoDto>(
            todos,
            query,
            TodoDto,
            query.orderBy
        );
    }

    async getTodoById(id: string): Promise<Todo | null> {
        return await this.todoRepository.findOne({
            where: {
                id
            },
            relations: {
                user: true
            }
        });
    }

    async createTodo(body: CreateDto, user: any): Promise<Todo> {
        const todoBody = UtilsService.transform<Todo>(body);

        const todoUser = await this.userService.getUserById(user.id);
        if (!todoUser) {
            throw new NotFoundError('User not found');
        }

        todoBody.user = user;

        return this.todoRepository.save(todoBody);
    }

    async updateTodo(id: string, body: UpdateDto): Promise<Todo> {
        const todoBody = UtilsService.transform<Todo>(body);

        const updatedTodo = await this.todoRepository.save({
            id,
            ...todoBody
        });

        await QueueJob.updateTodoQueueJob().add(QueueJobName.UPDATE_TODO, {
            id: id
        });

        return updatedTodo;
    }

    async deleteTodo(id: string): Promise<Todo> {
        const todo = await this.todoRepository.findOneBy({
            id
        });

        if (!todo) {
            throw new HttpException('Todo not found', 404);
        }

        await this.todoRepository.softDelete(id);

        return todo;
    }
}
