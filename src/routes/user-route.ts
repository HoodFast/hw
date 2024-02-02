import {Router} from "express";
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {UserQueryRepository} from "../repositories/UsersQueryRepository";

export const userRoute = Router({})

userRoute.get('/', (req,res)=>{
    const sortData = {
        searchNameTerm: req.query.searchNameTerm ?? null,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }

    const users = await UserQueryRepository.getAll(sortData)
    return res.send(users)
})