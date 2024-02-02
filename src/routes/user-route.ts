import {Router} from "express";
import { UserQueryRepository, UserSortDataSearchType} from "../repositories/UsersQueryRepository";
import {RequestWithQuery} from "../models/common/common";

export const userRoute = Router({})

userRoute.get('/', async (req:RequestWithQuery<UserSortDataSearchType>,res)=>{
    const sortData:UserSortDataSearchType = {
        searchLoginTerm: req.query.searchLoginTerm ?? null,
        searchEmailTerm: req.query.searchEmailTerm ?? null,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }

    const users = await UserQueryRepository.getAll(sortData)
    return res.send(users)
})