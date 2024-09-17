export default class HttpException extends Error {
    private readonly response;
    private readonly status;

    constructor(response: string | Record<string, any>, status: number) {
        super(response as any);
        this.response = response;
        this.status = status;
    }
}
