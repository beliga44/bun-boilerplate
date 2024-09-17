import { User } from '../user.entity';

export class UserDto {
    id: string;
    email: string;
    role: string;

    constructor(t: User) {
        this.id = t.id.toString();
        this.email = t.email;
        this.role = t.role.toString();
    }
}
