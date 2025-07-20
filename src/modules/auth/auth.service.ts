import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { AppDataSource } from '../../commons/db/postgres';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../user/dto/user.dto';
import HttpException from '../../commons/dto/http-exception';
import { UtilsService } from '../../commons/utils.service';
import { UserService } from '../user/user.service';
import { RedisService } from '../../commons/provider/redis.service';
import { injectable } from 'tsyringe';

@injectable()
export class AuthService {
    private userRepository: Repository<User>;
    private redisService: RedisService;

    constructor(userService: UserService, redisService: RedisService) {
        this.userRepository = AppDataSource.getRepository(User);
        this.redisService = redisService;
    }

    async login(body: LoginDto): Promise<UserDto> {
        const user = await this.userRepository.findOne({
            where: [
                {
                    email: body.email
                },
                {
                    username: body.email
                }
            ]
        });

        const isMatch = await Bun.password.verify(body.password, user?.password);

        if (!isMatch) {
            throw new HttpException('Invalid credential', 401);
        }

        return UtilsService.toDto(UserDto, user);
    }
}
