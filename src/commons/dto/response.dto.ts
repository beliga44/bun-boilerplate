export class ResponseDto<T> {
    data?: any
    status: number
    message: string

    constructor(ctx: any) {
        this.data = ctx?.response
        this.status = ctx?.set?.status
    }
}
