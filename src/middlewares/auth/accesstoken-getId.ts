import {NextFunction, Request, Response} from "express";
import {JwtService} from "../../application/jwt.service";




export const accessTokenGetId = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return next()
    }

    let tokenBearer = req.headers.authorization
    const token = tokenBearer.split(' ')
    const userId = await JwtService.getUserIdByToken(token[1])
    req.userId = userId
    return next()
}