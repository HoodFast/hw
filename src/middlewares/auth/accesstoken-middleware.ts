import {NextFunction, Request, Response} from "express";
import {JwtService} from "../../application/jwt.service";
import {UserQueryRepository} from "../../repositories/users.query.repository";
import {UserRepository} from "../../repositories/user.repository";
import {ObjectId} from "mongodb";



export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        console.log(`Авторизация не пройдена - ${req.headers.authorization}`)
        return res.sendStatus(401)
    }

    let tokenBearer = req.headers.authorization
    const token = tokenBearer.split(' ')
    const userId = await JwtService.getUserIdByToken(token[1])

    if (userId) {
        const user = await UserRepository.doesExistById(userId)
        if (!user) {
            return res.sendStatus(401)
        }
        const userData = await UserQueryRepository.getById(userId)
        req.userId = new ObjectId(userData!.id)
        return next()
    }

    res.sendStatus(401)
    return
}