import { UtilsService } from '../../commons/utils.service';
import HttpException from '../../commons/dto/http-exception';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuth } from '../../commons/provider/jwtAuth';

export class AuthHandler {
    private authService: AuthService;

    constructor(service: AuthService) {
        this.authService = service;
    }

    async getMe(): Promise<any> {
        return 'a';
    }

    async login(body: LoginDto): Promise<string> {
        const user = await this.authService.login(body);

        return new JwtAuth().sign(user);
    }
}
