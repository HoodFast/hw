import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt.service";
import {UserQueryRepository} from "../../repositories/users.query.repository";
import {OutputUsersType} from "../../models/users/output/output.users.models";

export interface UserAuthInfoRequest extends Request {
    user: OutputUsersType | null
}

// const loginCurrent = 'admin'
// const passwordCurrent = 'qwerty'
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (req.headers['authorization'] === "Basic YWRtaW46cXdlcnR5") {
        return next()
    }

    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    let tokenBearer = req.headers.authorization

    const token = tokenBearer.split(' ')

    const userId = await jwtService.getUserByToken(token[1])

    if (userId) {
        // @ts-ignore
        req.user = await UserQueryRepository.getById(userId)
        return next()
    }

    res.sendStatus(401)
    return

    // if (req.headers['authorization'] !== "Basic YWRtaW46cXdlcnR5") {
    //     res.sendStatus(401)
    //     return
    // }
    // const auth = req.headers['authorization']
    // if (!auth) {
    //     res.sendStatus(401)
    //     return
    // }
    // const [basic, token] = auth.split(' ')
    //
    // if (basic !== 'Basic') {
    //     res.sendStatus(401)
    //     return
    // }
    //
    // const decodedToken = Buffer.from(token, 'base64').toString()
    //
    // const [login, password] = decodedToken.split(':')
    // if (login !== loginCurrent || password !== passwordCurrent) {
    //     res.sendStatus(401)
    //     return
    // }

}