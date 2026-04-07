export type GetTotalPagesParams = {
    readonly limit: number;
    readonly count: number;
}

export const getTotalPages = (params: GetTotalPagesParams): number => {
    return params.limit > 0 ? Math.ceil(params.count / params.limit) : 1;
}