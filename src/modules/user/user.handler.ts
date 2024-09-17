import { CreateDto } from './dto/create.dto';
import { UserService } from './user.service';
import { UtilsService } from '../../commons/utils.service';
import HttpException from '../../commons/dto/http-exception';
import { UserDto } from './dto/user.dto';
import { QueryParamsDto } from '../../commons/dto/query-params.dto';
import { UpdateDto } from './dto/update.dto';

export class UserHandler {
    private userService: UserService;

    constructor(service: UserService) {
        this.userService = service;
    }

    async getUsers(query: QueryParamsDto): Promise<UserDto[]> {
        return UtilsService.toDto(
            UserDto,
            await this.userService.getUsers(query)
        );
    }

    async getUserById(id: string): Promise<UserDto> {
        const user = await this.userService.getUserById(id);

        if (!user) {
            throw new HttpException('Todo not found', 404);
        }

        return UtilsService.toDto(UserDto, user);
    }

    async createUser(createDto: CreateDto): Promise<UserDto> {
        return UtilsService.toDto(
            UserDto,
            await this.userService.createUser(createDto)
        );
    }

    async updateUser(id: string, updateDto: UpdateDto): Promise<UserDto> {
        return UtilsService.toDto(
            UserDto,
            await this.userService.updateUser(id, updateDto)
        );
    }
}
