import { AbstractEntity } from './abstract.entity';

export class AbstractDto {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor(entity: AbstractEntity) {
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
        this.deletedAt = entity.deletedAt;
    }
}
