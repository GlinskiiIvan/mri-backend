import { SortOrder } from "src/common/enums";
import { FindAllQueryDto } from "./dto/findAllQuery.dto";

export type FindAllServiceParams = {
    readonly filterBy?: string;
    readonly filterValue?: string;
    readonly sortBy?: string;
    readonly sortOrder?: SortOrder;
    readonly dateFrom?: Date;
    readonly dateTo?: Date;
    readonly pageSize: number;
    readonly page: number;
    readonly offset: number;
}

export const buildFindAllParams = (query: FindAllQueryDto): FindAllServiceParams => {
    return {
        filterBy: query.filterBy, 
        filterValue: query.filterValue, 
        sortBy: query.sortBy, 
        sortOrder: query.sortOrder, 
        dateFrom: query.dateFrom ?? new Date(0), 
        dateTo: query.dateTo ?? new Date(), 
        pageSize: query.pageSize, 
        page: query.page, 
        offset: query.page*query.pageSize-query.pageSize,
    };
}