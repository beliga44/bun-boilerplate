import { User } from './user.entity';
import { AppDataSource } from '../../commons/db/postgres';
import { Brackets, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UtilsService } from '../../commons/utils.service';
import { UpdateDto } from './dto/update.dto';
import {
    PaginateService,
    Pagination
} from '../../commons/provider/paginate.service';
import { UserQueryParamsDto } from './dto/user-query-params.dto';
import { UserDto } from './dto/user.dto';
import HttpException from '../../commons/dto/http-exception';
import { inject, injectable } from 'tsyringe';
import { ConflictError } from '../../commons/error/conflict.error';
import { NotFoundError } from '../../commons/error/not-found.error';

@injectable()
export class UserService {
    private userRepository: Repository<User>;
    private paginateService: PaginateService;

    constructor(@inject(PaginateService) paginateService: PaginateService) {
        this.userRepository = AppDataSource.getRepository(User);
        this.paginateService = paginateService;
    }

    async getUsers(query: UserQueryParamsDto): Promise<Pagination<UserDto>> {
        const users = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.courseProvider', 'courseProvider');

        if (query.role) {
            users.andWhere('TEXT(user.role) = :role', {
                role: query.role.toString()
            });
        }

        if (query.search) {
            users.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('user.name ILIKE :q', { q: `%${query.search}%` })
                        .orWhere('user.email ILIKE :q', {
                            q: `%${query.search}%`
                        })
                        .orWhere('user.username ILIKE :q', {
                            q: `%${query.search}%`
                        });
                })
            );
        }

        return this.paginateService.paginateQueryBuilder<User, UserDto>(
            users,
            query,
            UserDto,
            query.orderBy
        );
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: {
                id: id
            },
            relations: {
                todos: true
            }
        });
    }

    async createUser(body: CreateDto): Promise<User> {
        try {
            const userBody = UtilsService.transform<User>(body);
            userBody.password = await Bun.password.hash(userBody.password);

            const newUser = await this.userRepository.save(userBody);
            return newUser;
        } catch (error) {
            if (error.code === '23505') {
                // 23505 = unique_violation in PostgreSQL
                throw new ConflictError('User with this email already exists');
            }
            throw error;
        }
    }

    async updateUser(id: string, body: UpdateDto): Promise<User> {
        const userBody = UtilsService.transform<User>(body);
        if (userBody.password) {
            userBody.password = await Bun.password.hash(userBody.password);
        }

        const updatedUser = await this.userRepository.save({
            id,
            ...userBody
        });

        // Make sure to return all fields of the updated user
        return await this.userRepository.findOneByOrFail({ id: updatedUser.id });
    }

    async deleteUser(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({
            id
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        await this.userRepository.softDelete(id);

        return user;
    }
}
