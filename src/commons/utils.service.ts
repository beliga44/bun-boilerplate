export class UtilsService {
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E,
        options?: Record<string, any>
    ): T
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E[],
        options?: Record<string, any>
    ): T[]
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E | E[],
        options?: Record<string, any>
    ): T | T[] {
        if (Array.isArray(entity)) {
            return entity.map((u) => new model(u, options))
        }

        return new model(entity, options)
    }
}
