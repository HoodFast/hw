
import {Request, Response, Router} from "express";
import {AuthService} from "../services/auth.service";
import {RequestWithBody, ResultCode} from "../models/common/common";
import {AuthInputType} from "../models/auth/input/auth.input.model";
import {authValidation} from "../validators/auth-validators";
import {accessTokenGuard} from "../middlewares/auth/accesstoken-middleware";
import {UserInputModelType} from "../models/users/input/user.input.model";
import {userValidators} from "../validators/users-validator";
import {UserService} from "../services/user.service";
import {OutputUsersType} from "../models/users/output/output.users.models";
import {Result} from "../types/result.type";
import {codeValidation} from "../validators/confirm-validators";
import {emailValidation} from "../validators/email-validators";
import {rateLimitMiddleware} from "../middlewares/rateLimutMiddleware/rateLimit.middleware";
import {recoveryPassInputType} from "../models/recoveryPass/input/recover.input.model";
import {recoverTokenGuard} from "../middlewares/auth/recover-token-middleware";
import {recoveryValidation} from "../validators/recovery-validators";
import {emailPassRecoverValidation} from "../validators/email-pass-recover-validators";
import {container} from "../composition-root";
import {injectable} from "inversify";
import {JwtService} from "../application/jwt.service";


export const authRoute = Router({})
@injectable()
export class AuthController {
    constructor(protected authService: AuthService) {
    }

    async getMe(req: Request, res: Response) {

        const userId = req.userId!
        if (!userId) return res.sendStatus(401)
        const me = await this.authService.me(userId)
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

    async login(req: RequestWithBody<AuthInputType>, res: Response) {
        const title = req.headers['user-agent'] || 'none title'
        const ip = req.ip || 'none ip'
        const user = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) return res.sendStatus(401)
        const tokens = await this.authService.loginTokensPair(user, ip, title)

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
    }

    async logout(req: Request, res: Response) {

        const deleteToken = await this.authService.deleteSession(req.cookies.refreshToken)

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
    }

    async registration(req: RequestWithBody<UserInputModelType>, res: Response) {

        const createdUser: Result<OutputUsersType | null> = await UserService.createUser(req.body.login, req.body.email, req.body.password)

        switch (createdUser.code) {
            case ResultCode.NotFound:
                return res.sendStatus(404)
            case ResultCode.Success:
                return res.sendStatus(204)
            default:
                return res.sendStatus(404)
        }
    }

    async registrationEmailConfirmation(req: RequestWithBody<{
        code: string
    }>, res: Response) {
        const code = req.body.code
        if (!code) return res.sendStatus(404)
        const confirm = await this.authService.confirmEmail(code)

        switch (confirm.code) {
            case ResultCode.NotFound:
                return res.sendStatus(404)
            case ResultCode.Success:
                return res.sendStatus(204)
            default:
                return res.sendStatus(404)
        }
    }

    async registrationEmailResending(req: RequestWithBody<{
        email: string
    }>, res: Response) {

        const sendEmail = await this.authService.resendConfirmationCode(req.body.email)
        switch (sendEmail.code) {
            case ResultCode.Success:
                return res.sendStatus(204)
            case ResultCode.NotFound:
                return res.sendStatus(404)
            default:
                return res.sendStatus(404)
        }
    }

    async passwordRecovery(req: RequestWithBody<{ email: string }>, res: Response) {

        const email = req.body.email
        const recoverySend = await this.authService.sendRecoveryPass(email)

        switch (recoverySend.code) {
            case ResultCode.Success:
                return res.sendStatus(204)
            default:
                return res.sendStatus(404)
        }
    }

    async changePassword(req: RequestWithBody<recoveryPassInputType>, res: Response) {
        const newPass = req.body.newPassword
        const recoverPass = await UserService.recoveryPass(req.userId!, newPass)

        switch (recoverPass.code) {
            case ResultCode.Success:
                return res.sendStatus(204)
            default:
                return res.sendStatus(404)
        }
    }

    async refreshToken(req: Request, res: Response) {
        const title = req.headers['user-agent'] || 'none title'
        const ip = req.ip || 'none ip'
        const token = req.cookies.refreshToken
        const user = await JwtService.checkRefreshToken(token)
        if (!user) return res.sendStatus(401)

        const tokens = await this.authService.refreshTokensPair(user, ip, title, token)

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
    }
}

const authController = container.resolve<AuthController>(AuthController)

authRoute.get('/me', accessTokenGuard, authController.getMe.bind(authController))
authRoute.post('/login', rateLimitMiddleware, authValidation(), authController.login.bind(authController))
authRoute.post('/logout', authController.logout.bind(authController))
authRoute.post('/registration', rateLimitMiddleware, userValidators(), authController.registration.bind(authController))
authRoute.post('/registration-confirmation', rateLimitMiddleware, codeValidation(), authController.registrationEmailConfirmation.bind(authController))
authRoute.post('/registration-email-resending', rateLimitMiddleware, emailValidation(), authController.registrationEmailResending.bind(authController))
authRoute.post('/password-recovery', rateLimitMiddleware, emailPassRecoverValidation(), authController.passwordRecovery.bind(authController))
authRoute.post('/new-password', rateLimitMiddleware, recoveryValidation(), recoverTokenGuard, authController.changePassword.bind(authController))
authRoute.post('/refresh-token',recoverTokenGuard, authController.refreshToken.bind(authController))





