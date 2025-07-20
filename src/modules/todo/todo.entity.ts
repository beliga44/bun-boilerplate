import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../commons/abstract.entity';
import { User } from '../user/user.entity';

type UserEntity = User

@Entity({
    name: 'todos'
})
export class Todo extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => User, (user) => user.todos)
    user: UserEntity;
}
