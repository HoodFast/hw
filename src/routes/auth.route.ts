import {Request, Response, Router} from "express";
import {authService} from "../services/auth.service";
import {RequestWithBody, ResultCode} from "../models/common/common";
import {AuthInputType} from "../models/auth/input/auth.input.model";
import {authValidation} from "../validators/auth-validators";
import {jwtService} from "../application/jwt.service";
import {accessTokenGuard} from "../middlewares/auth/accesstoken-middleware";
import {UserInputModelType} from "../models/users/input/user.input.model";
import {userValidators} from "../validators/users-validator";
import {userService} from "../services/user.service";
import {OutputUsersType} from "../models/users/output/output.users.models";
import {Result} from "../types/result.type";
import {codeValidation} from "../validators/confirm-validators";
import {emailValidation} from "../validators/email-validators";
import {rateLimitMiddleware} from "../middlewares/rateLimutMiddleware/rateLimit.middleware";
import {recoveryPassInputType} from "../models/recoveryPass/input/recover.input.model";
import {recoverTokenGuard} from "../middlewares/auth/recover-token-middleware";
import {recoveryValidation} from "../validators/recovery-validators";
import {emailPassRecoverValidation} from "../validators/email-pass-recover-validators";

export const authRoute = Router({})


authRoute.get('/me', accessTokenGuard, async (req: Request, res: Response) => {

        const userId = req.userId!
        if (!userId) return res.sendStatus(401)
        const me = await authService.me(userId)
        switch (me.code) {
            case ResultCode.Success:
                return res.status(200).send(me.data)
            case ResultCode.NotFound:
                return res.sendStatus(404)
            case ResultCode.Forbidden:
                return res.sendStatus(401)
            default:
                return res.sendStatus(404)
        }


    }
)


authRoute.post('/login', rateLimitMiddleware, authValidation(), async (req: RequestWithBody<AuthInputType>, res: Response) => {
    const title = req.headers['user-agent'] || 'none title'
    const ip = req.ip || 'none ip'
    const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user) return res.sendStatus(401)
    const tokens = await authService.loginTokensPair(user, ip, title)

    switch (tokens.code) {
        case ResultCode.Success:
            const {accessToken, refreshToken} = tokens.data!
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            return res.status(200).send({accessToken})
        case ResultCode.Forbidden:
            return res.sendStatus(400)
        case ResultCode.NotFound:
            return res.sendStatus(404)
        default:
            return res.sendStatus(404)
    }


})

authRoute.post('/registration-email-resending', rateLimitMiddleware, emailValidation(), async (req: RequestWithBody<{
    email: string
}>, res: Response) => {

    const sendEmail = await authService.resendConfirmationCode(req.body.email)
    switch (sendEmail.code) {
        case ResultCode.Success:
            return res.sendStatus(204)
        case ResultCode.NotFound:
            return res.sendStatus(404)
        default:
            return res.sendStatus(404)
    }

})

authRoute.post('/registration', rateLimitMiddleware, userValidators(), async (req: RequestWithBody<UserInputModelType>, res: Response) => {

    const createdUser: Result<OutputUsersType | null> = await userService.createUser(req.body.login, req.body.email, req.body.password)

    switch (createdUser.code) {
        case ResultCode.NotFound:
            return res.sendStatus(404)
        case ResultCode.Success:
            return res.sendStatus(204)
        default:
            return res.sendStatus(404)
    }
})


authRoute.post('/registration-confirmation', rateLimitMiddleware, codeValidation(), async (req: RequestWithBody<{
    code: string
}>, res: Response) => {
    const code = req.body.code
    if (!code) return res.sendStatus(404)
    const confirm = await authService.confirmEmail(code)

    switch (confirm.code) {
        case ResultCode.NotFound:
            return res.sendStatus(404)
        case ResultCode.Success:
            return res.sendStatus(204)
        default:
            return res.sendStatus(404)
    }

})

authRoute.post('/refresh-token', async (req: Request, res: Response) => {
    const title = req.headers['user-agent'] || 'none title'
    const ip = req.ip || 'none ip'
    const token = req.cookies.refreshToken
    const user = await jwtService.checkRefreshToken(token)
    if (!user) return res.sendStatus(401)

    const tokens = await authService.refreshTokensPair(user, ip, title, token)

    switch (tokens.code) {

        case ResultCode.Success:
            res.cookie('refreshToken', tokens.data!.refreshToken, {httpOnly: true, secure: true})
            return res.status(200).send({accessToken: tokens.data!.accessToken})
        case ResultCode.Unauthorized:
            return res.sendStatus(401)
        case ResultCode.Forbidden:
            return res.sendStatus(403)
        case ResultCode.NotFound:
            return res.sendStatus(404)
        default:
            return res.sendStatus(404)
    }
})

authRoute.post('/logout', async (req: Request, res: Response) => {

    const deleteToken = await authService.deleteSession(req.cookies.refreshToken)

    switch (deleteToken.code) {
        case ResultCode.Success:
            return res.sendStatus(204)
        case ResultCode.Unauthorized:
            return res.sendStatus(401)
        case ResultCode.Forbidden:
            return res.sendStatus(403)
        case ResultCode.NotFound:
            return res.sendStatus(404)
        default:
            return res.sendStatus(404)
    }
})


authRoute.post('/password-recovery', rateLimitMiddleware, emailPassRecoverValidation(), async (req: RequestWithBody<{
    email: string
}>, res: Response) => {

    const email = req.body.email
    const recoverySend = await authService.sendRecoveryPass(email)

    switch (recoverySend.code) {
        case ResultCode.Success:
            return res.sendStatus(204)
        default:
            return res.sendStatus(404)
    }
})

authRoute.post('/new-password', rateLimitMiddleware, recoveryValidation(), recoverTokenGuard, async (req: RequestWithBody<recoveryPassInputType>, res: Response) => {
    const newPass = req.body.newPassword
    const recoverPass = await userService.recoveryPass(req.userId!, newPass)

    switch (recoverPass.code) {
        case ResultCode.Success:
            return res.sendStatus(204)
        default:
            return res.sendStatus(404)
    }
})