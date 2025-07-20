import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../commons/enum/role.enum';
import { AbstractEntity } from '../../commons/abstract.entity';
import { Todo } from '../todo/todo.entity';

@Entity({
    name: 'users'
})
export class User extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    email: string;

    @Column({
        nullable: true
    })
    name: string;

    @Column({
        nullable: true,
        unique: true
    })
    username: string;

    @Column({
        nullable: true
    })
    password: string;

    @Column({
        enum: UserRole,
        type: 'enum',
        default: UserRole.GENERAL
    })
    role: UserRole;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[];
}
