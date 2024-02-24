import {SortDataType} from "../repositories/blog.query.repository";

type SortQueryFieldsType = {
    sortBy: string | undefined
    sortDirection: "asc" | "desc" | undefined
    pageNumber: number | undefined
    pageSize: number | undefined
}

export const sortQueryFieldsUtil = (query: SortQueryFieldsType) => {
    const pageNumber = !isNaN(Number(query.pageNumber))
        ? Number(query.pageNumber)
        : 1
    const pageSize = !isNaN(Number(query.pageSize))
        ? Number(query.pageSize)
        : 10
    const sortBy = query.sortBy ? query.sortBy : 'createdAt'
    const sortDirection : "asc"|"desc" = query.sortDirection === 'asc' ? query.sortDirection : 'desc'
    const result = {
        pageNumber,
        pageSize,
        sortDirection,
        sortBy
    }
    return result
}