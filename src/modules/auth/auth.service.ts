import { Repository } from 'typeorm'
import { User } from '../user/user.entity'
import { AppDataSource } from '../../commons/db/postgres'
import { LoginDto } from './dto/login.dto'
import { UserDto } from '../user/dto/user.dto'
import HttpException from '../../commons/dto/http-exception'
import { UtilsService } from '../../commons/utils.service'

export class AuthService {
    private userRepository: Repository<User>

    constructor() {
        this.userRepository = AppDataSource.getRepository(User)
    }

    async login(body: LoginDto): Promise<UserDto> {
        const user = await this.userRepository.findOne({
            where: {
                email: body.email
            }
        })

        if (!user) {
            throw new HttpException('User is not found', 404)
        }

        const isMatch = await Bun.password.verify(body.password, user?.password)

        return UtilsService.toDto(UserDto, user)
    }
}
