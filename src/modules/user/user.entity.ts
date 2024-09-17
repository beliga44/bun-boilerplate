import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { UserRole } from '../../commons/enum/role.enum'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    email: string

    @Column()
    password: string

    @Column({
        enum: UserRole,
        type: 'enum',
        default: UserRole.SUPER_ADMIN
    })
    role: UserRole
}
