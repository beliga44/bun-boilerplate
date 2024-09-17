import { User } from './user.entity'
import { AppDataSource } from '../../commons/db/postgres'
import { Repository } from 'typeorm'
import { CreateDto } from './dto/create.dto'
import { UtilsService } from '../../commons/utils.service'
import { QueryParamsDto } from '../../commons/dto/query-params.dto'
import { UpdateDto } from './dto/update.dto'

export class UserService {
    private userRepository: Repository<User>

    constructor() {
        this.userRepository = AppDataSource.getRepository(User)
    }

    async getUsers(query: QueryParamsDto): Promise<User[]> {
        return this.userRepository.find({
            take: query.limit,
            skip: (query.page - 1) * query.limit,
            order: {
                id: query.sort
            }
        })
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({
            id
        })
    }

    async createUser(body: CreateDto): Promise<User> {
        const userBody = UtilsService.transform<User>(body)
        userBody.password = await Bun.password.hash(userBody.password)
        return this.userRepository.save(userBody)
    }

    async updateUser(id: string, body: UpdateDto): Promise<User> {
        const userBody = UtilsService.transform<User>(body)
        if (userBody.password) {
            userBody.password = await Bun.password.hash(userBody.password)
        }

        return this.userRepository.save({
            id,
            ...userBody
        })
    }
}
