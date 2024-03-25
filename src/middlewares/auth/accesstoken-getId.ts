import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt.service";
import {UserQueryRepository} from "../../repositories/users.query.repository";
import {UserRepository} from "../../repositories/user.repository";
import {ObjectId} from "mongodb";



export const accessTokenGetId = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return next()
    }

    let tokenBearer = req.headers.authorization
    const token = tokenBearer.split(' ')
    const userId = await jwtService.getUserIdByToken(token[1])
    req.userId = userId
    return next()
}