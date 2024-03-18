import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt.service";
import {UserQueryRepository} from "../../repositories/users.query.repository";
import {UserRepository} from "../../repositories/user.repository";
import {RequestWithBody} from "../../models/common/common";
import {recoveryPassInputType} from "../../models/recoveryPass/input/recover.input.model";


export const recoverTokenGuard = async (req: RequestWithBody<recoveryPassInputType>, res: Response, next: NextFunction) => {
    let token = req.body.recoveryCode
    const userId = await jwtService.getUserByRecoverToken(token)
    if (!userId) return res.sendStatus(400)
    const user = await UserRepository.getUserById(userId)
    if(!user) return res.sendStatus(400)
    req.userId = user._id
    return next()
}