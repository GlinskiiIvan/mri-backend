import { Op, WhereOptions } from "sequelize";

export type BuildWhereParams = {
    readonly dateFrom?: Date;
    readonly dateTo?: Date;
    readonly filterBy?: string;
    readonly filterValue?: string | number | boolean | Date;
}

const buildFilter = (by: string, value: string | number | boolean | Date) => {
    if(typeof value === 'string') {
        return  {
            [by]: { [Op.iLike]: `%${value}%` },
        }
    } else {
        return {
            [by]: { [Op.eq]: value },
        }
    }
}

export const buildWhere = <T>(params: BuildWhereParams): WhereOptions<T> => {
    return {
        ...(params.dateFrom || params.dateTo ? {
            createdAt: {
                ...(params.dateFrom && {[Op.gte]: params.dateFrom}),
                ...(params.dateTo && {[Op.lte]: params.dateTo}),
            }
        } : {}),
        ...(params.filterBy && params.filterValue ? 
            buildFilter(params.filterBy, params.filterValue) : {})
    }
}