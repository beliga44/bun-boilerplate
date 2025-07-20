export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
        this.message = message;
        this.stack = new Error().stack;
    }
}
