import { getTotalPages } from "./getTotalPages";

export type BuildResultDataParams<T> = {
    readonly rows: T[]; 
    readonly limit: number; 
    readonly count: number;
    readonly page: number
}

export const buildResultData = <T>(params: BuildResultDataParams<T>) => {
    return {
        data: params.rows,
        totalPages: getTotalPages({limit: params.limit, count: params.count}),
        totalItems: params.count,
        currentPage: params.page || 1,
    };
}