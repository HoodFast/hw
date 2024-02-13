import {Request, Response, Router} from "express";
import {authService} from "../services/auth.service";
import {RequestWithBody} from "../models/common/common";
import {AuthInputType} from "../models/auth/input/auth.input.model";
import {authValidation} from "../validators/auth-validators";
import {jwtService} from "../application/jwt.service";
import {accessTokenGuard} from "../middlewares/auth/accesstoken-middleware";
import {UserQueryRepository} from "../repositories/users.query.repository";


export const authRoute = Router({})


authRoute.get('/me', accessTokenGuard,
    async (req: Request, res:Response) => {

        const userId = req.user?.id
        if(!userId) return res.sendStatus(401)
        const me = await UserQueryRepository.getById(userId)
        return res.status(200).send(me)

    }
)

authRoute.post('/login', authValidation(), async (req: RequestWithBody<AuthInputType>, res: Response) => {

    const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (user) {
        const token = await jwtService.createJWT(user)
        return res.status(200).send({accessToken: token})
    } else {
        return res.sendStatus(401)
    }

})