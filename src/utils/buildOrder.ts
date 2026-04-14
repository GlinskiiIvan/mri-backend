import { OrderItem } from "sequelize";

export type BuildOrderParams = {
    readonly sortBy?: string;
    readonly sortOrder?: 'asc' | 'desc';
}

export const buildOrder = (params: BuildOrderParams): OrderItem[] => {
    const normalizedOrder: 'ASC' | 'DESC' = 
    params.sortOrder && ['asc', 'desc'].includes(params.sortOrder.toLowerCase())
      ? (params.sortOrder.toUpperCase() as 'ASC' | 'DESC')
      : 'ASC';

  return params.sortBy ? [[params.sortBy, normalizedOrder]] : [['createdAt', 'DESC']];
}