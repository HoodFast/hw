import {NextFunction, raw, Request, Response} from "express";
import {jwtService} from "../../application/jwt.service";
import {userService} from "../../services/user.service";
import {UserQueryRepository} from "../../repositories/users.query.repository";


const loginCurrent = 'admin'
const passwordCurrent = 'qwerty'
export const authMiddleware = async (req:any, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId =await jwtService.getUserByToken(token)
    if(userId){
        req.user = await UserQueryRepository.getById(userId)
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