import bcrypt from "bcrypt";
import {UserQueryRepository} from "../repositories/users.query.repository";
import {WithId} from "mongodb";
import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {emailAdapter} from "../adapters/email.adapter";
import {UserRepository} from "../repositories/user.repository";
import {v4 as uuidv4} from "uuid";
import {Result} from "../types/result.type";
import {ResultCode} from "../models/common/common";
import {jwtService} from "../application/jwt.service";
import {TokenMetaRepository} from "../repositories/tokenMeta.repository";

export class authService {
    static async me(userId: string) {
        const user = await UserQueryRepository.getById(userId)
        if (!user) return {code: ResultCode.NotFound}
        return {code: ResultCode.Success, data: {email: user.email, login: user.login, userId: user.id}}
    }

    static async deleteSession(token: string) {
        const metaData = await jwtService.getMetaDataByToken(token)
        if (!metaData) return {code: ResultCode.Unauthorized}
        const oldSession = await TokenMetaRepository.getSessionForRefresh(metaData.iat, metaData.deviceId)
        if (oldSession) {
            await TokenMetaRepository.deleteById(oldSession._id)
        } else {
            return {code: ResultCode.Unauthorized}
        }
        return {code: ResultCode.Success}
    }

    // static async refreshToken(token: string, ip: string, title: string) {
    //     const userId = await jwtService.getUserIdByRefreshToken(token)
    //     if (!userId) return {code: ResultCode.Forbidden}
    //     const user = await UserQueryRepository.getDBUserById(userId)
    //     if (!user) return {code: ResultCode.NotFound}
    //     const accessToken = await jwtService.createJWT(user)
    //     const refreshToken = await jwtService.createRefreshJWT(user, ip, title)
    //     await UserRepository.putTokenInBL(userId, token)
    //     return {code: ResultCode.Success, data: {accessToken, refreshToken}}
    // }

    static async loginTokensPair(user: WithId<UsersTypeDb>, ip: string, title: string) {
        const userId = user._id
        const oldSession = await TokenMetaRepository.getSessionForLogin(userId, title)
        const deviceId = oldSession?.deviceId
        if (oldSession) {
            await TokenMetaRepository.deleteById(oldSession._id)
        }

        const accessToken = await jwtService.createJWT(user)
        if (!accessToken) return {code: ResultCode.Forbidden}

        const refreshToken = await jwtService.createRefreshJWT(user, deviceId, ip, title)
        if (!refreshToken) return {code: ResultCode.Forbidden}

        return {code: ResultCode.Success, data: {accessToken, refreshToken}}
    }

    static async refreshTokensPair(user: WithId<UsersTypeDb>, ip: string, title: string, token: string) {
        const metaData = await jwtService.getMetaDataByToken(token)
        if (!metaData) return {code: ResultCode.Unauthorized}
        const oldSession = await TokenMetaRepository.getSessionForRefresh(metaData.iat, metaData.deviceId)
        const deviceId = oldSession?.deviceId
        if (oldSession) {
            await TokenMetaRepository.deleteById(oldSession._id)
        } else {
            return {code: ResultCode.Unauthorized}
        }
        const accessToken = await jwtService.createJWT(user)
        if (!accessToken) return {code: ResultCode.Forbidden}

        const refreshToken = await jwtService.createRefreshJWT(user,deviceId, ip, title)
        if (!refreshToken) return {code: ResultCode.Forbidden}

        return {code: ResultCode.Success, data: {accessToken, refreshToken}}
    }


    static async resendConfirmationCode(email: string):
        Promise<Result> {
        const user = await UserQueryRepository.getByLoginOrEmail(email)

        if (!
            user
        )
            return {code: ResultCode.NotFound}
        const newConfirmationCode = uuidv4()
        const updateConfirmCode = await UserRepository.updateNewConfirmCode(user._id, newConfirmationCode)
        if (!updateConfirmCode) return {code: ResultCode.NotFound}
        const subject = "Email Confirmation"
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newConfirmationCode}'>complete registration</a>
        </p>`
        const sendCode = await emailAdapter.sendEmail(email, subject, message)
        if (!sendCode) return {code: ResultCode.NotFound}
        return {code: ResultCode.Success}
    }

    static async sendConfirmCode(email: string) {
        const user = await UserQueryRepository.getByLoginOrEmail(email)
        if (!user) return false
        const subject = "Email Confirmation"
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>`
        const sendCode = await emailAdapter.sendEmail(email, subject, message)
        if (!sendCode) return false
        return true
    }

    static async confirmEmail(code: string):
        Promise<Result> {
        const user = await UserQueryRepository.getByCode(code)
        if (!
            user
        )
            return {code: ResultCode.Forbidden}
        if (user.emailConfirmation.isConfirmed) return {code: ResultCode.Forbidden}
        if (user.emailConfirmation.expirationDate < new Date()) return {
            code: ResultCode.Forbidden,
            errorMessage: {message: 'expired', field: 'expirationDate'}
        }
        const updateConfirm = await UserRepository.updateConfirmation(user!._id)
        if (updateConfirm) return {code: ResultCode.Success}
        return {code: ResultCode.NotFound}
    }

    static async checkCredentials(loginOrEmail: string, password: string):
        Promise<WithId<UsersTypeDb> | null> {
        const user = await UserQueryRepository.getByLoginOrEmail(loginOrEmail)
        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null
        const res = await bcrypt.compare(password, user.accountData._passwordHash)
        if (!res) {
            return null
        } else {
            return user
        }
    }
}