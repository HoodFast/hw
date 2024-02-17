import {Request, Response, Router} from "express";
import {authService} from "../services/auth.service";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/common/common";
import {AuthInputType} from "../models/auth/input/auth.input.model";
import {authValidation} from "../validators/auth-validators";
import {jwtService} from "../application/jwt.service";
import {accessTokenGuard} from "../middlewares/auth/accesstoken-middleware";
import {UserQueryRepository} from "../repositories/users.query.repository";
import {UserInputModelType} from "../models/users/input/user.input.model";
import {userValidators} from "../validators/users-validator";
import {userService} from "../services/user.service";
import {OutputUsersType} from "../models/users/output/output.users.models";


export const authRoute = Router({})


authRoute.get('/me', accessTokenGuard,
    async (req: Request, res: Response) => {

        const userId = req.user?.id
        if (!userId) return res.sendStatus(401)
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

authRoute.post('/registration-email-resending', async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const sendEmail = await authService.resendConfirmationCode(req.body.email)
    if (!sendEmail) return res.sendStatus(404)
    return res.sendStatus(204)
})

authRoute.post('/registration', userValidators(), async (req: RequestWithBody<UserInputModelType>, res: Response) => {

    const createdUser: OutputUsersType | null = await userService.createUser(req.body.login, req.body.email, req.body.password)

    if (!createdUser) return res.sendStatus(404)

    return res.sendStatus(204)
})

authRoute.post('/registration-confirmation', async (req: RequestWithQuery<{ code: string }  >, res: Response) => {
    const code = req.query.code
    if(!code) return res.sendStatus(404)
    const confirm = await authService.confirmEmail(code)
    if(!confirm) return res.sendStatus(404)
    return res.sendStatus(204)
})