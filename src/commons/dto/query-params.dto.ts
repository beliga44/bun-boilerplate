export class QueryParamsDto {
    limit: number
    page: number
    search: string
    sort: string

    constructor(ctx: any) {
        this.limit = +ctx?.limit || 100
        this.page = +ctx?.page || 1
        this.search = ctx?.search || null
        this.sort = ctx?.sort || 'DESC'
    }
}
