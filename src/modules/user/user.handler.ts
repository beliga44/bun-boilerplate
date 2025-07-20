import { CreateDto } from './dto/create.dto';
import { UserService } from './user.service';
import { UtilsService } from '../../commons/utils.service';
import HttpException from '../../commons/dto/http-exception';
import { UserDto } from './dto/user.dto';
import { UpdateDto } from './dto/update.dto';
import { UserQueryParamsDto } from './dto/user-query-params.dto';
import { Pagination } from '../../commons/provider/paginate.service';
import { ConflictError } from '../../commons/error/conflict.error';

export class UserHandler {
    private userService: UserService;

    constructor(service: UserService) {
        this.userService = service;
    }

    async getUsers(query: UserQueryParamsDto): Promise<Pagination<UserDto>> {
        return await this.userService.getUsers(query);
    }

    async getUserById(id: string): Promise<UserDto> {
        const user = await this.userService.getUserById(id);

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        return UtilsService.toDto(UserDto, user);
    }

    async createUser(createDto: CreateDto): Promise<UserDto> {
        try {
            return UtilsService.toDto(
                UserDto,
                await this.userService.createUser(createDto)
            );
        } catch (e) {
            if (e instanceof ConflictError) {
                throw new HttpException(e.message, 409);
            }
            throw e;
        }
    }

    async updateUser(id: string, updateDto: UpdateDto): Promise<UserDto> {
        return UtilsService.toDto(
            UserDto,
            await this.userService.updateUser(id, updateDto)
        );
    }

    async deleteUser(id: string): Promise<UserDto> {
        return UtilsService.toDto(
            UserDto,
            await this.userService.deleteUser(id)
        );
    }
}
