import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuth } from '../../commons/provider/jwt-auth';

export class AuthHandler {
    private authService: AuthService;

    constructor(service: AuthService) {
        this.authService = service;
    }

    async login(body: LoginDto): Promise<string> {
        const user = await this.authService.login(body);

        return new JwtAuth().sign(user);
    }
}
