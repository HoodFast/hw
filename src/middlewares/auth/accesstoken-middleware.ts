import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt.service";
import {UserQueryRepository} from "../../repositories/users.query.repository";
import {UserRepository} from "../../repositories/user.repository";


export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    let tokenBearer = req.headers.authorization

    const token = tokenBearer.split(' ')

    const userId = await jwtService.getUserIdByToken(token[1])

    if (userId) {
        const user = await UserRepository.doesExistById(userId)
        if (!user) {
            return res.sendStatus(401)
        }
        req.user = await UserQueryRepository.getById(userId)
        return next()
    }

    res.sendStatus(401)
    return
}