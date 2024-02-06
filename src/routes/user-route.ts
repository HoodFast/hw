import {Response, Router} from "express";
import {UserQueryRepository, UserSortDataSearchType} from "../repositories/users.query.repository";
import {
    Pagination,
    ParamsType,
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery,
    ResponseType
} from "../models/common/common";
import {OutputUsersType} from "../models/users/output/output.users.models";
import {UserInputModelType} from "../models/users/input/user.input.model";
import {userService} from "../services/user.service";
import {ObjectId} from "mongodb";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {userValidators} from "../validators/users-validator";

export const userRoute = Router({})

userRoute.get('/',authMiddleware, async (req: RequestWithQuery<UserSortDataSearchType>, res:ResponseType<Pagination<OutputUsersType>> | any) => {
    const sortData: UserSortDataSearchType = {
        searchLoginTerm: req.query.searchLoginTerm ?? null,
        searchEmailTerm: req.query.searchEmailTerm ?? null,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }
debugger
    const users = await UserQueryRepository.getAll(sortData)
    return res.send(users)
})

userRoute.post('/',authMiddleware,userValidators(), async (req: RequestWithBody<UserInputModelType>, res: ResponseType<OutputUsersType>) => {
    const createdUser = await userService.createUser(req.body.login, req.body.email, req.body.password)
    if (!createdUser) {
        res.sendStatus(404)
        return
    }
    res.status(201).send(createdUser)
})

userRoute.delete('/:id',authMiddleware, async (req: RequestWithParams<ParamsType>, res: Response) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }
    const userIsDeleted = await userService.deleteUser(id)
    if (!userIsDeleted) {
        res.sendStatus(404)
        return
    }
    return res.sendStatus(204)
})