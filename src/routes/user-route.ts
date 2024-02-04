import {Router} from "express";
import { UserQueryRepository, UserSortDataSearchType} from "../repositories/users.query.repository";
import {RequestWithBody, RequestWithQuery, ResponseType} from "../models/common/common";
import {OutputUsersType} from "../models/users/output/output.users.models";
import {UserInputModelType} from "../models/users/input/user.input.model";
import {userService} from "../services/user.service";

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

userRoute.post('/',async (req:RequestWithBody<UserInputModelType>,res:ResponseType<OutputUsersType>)=>{
    const createdUser = await userService.createUser(req.body.login,req.body.email,req.body.password)
    if (!createdUser) {
        res.sendStatus(404)
        return
    }
    res.status(201).send(createdUser)
})
