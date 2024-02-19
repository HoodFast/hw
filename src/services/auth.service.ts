import bcrypt from "bcrypt";
import {UserQueryRepository} from "../repositories/users.query.repository";
import {WithId} from "mongodb";
import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {emailAdapter} from "../adapters/email.adapter";
import {UserRepository} from "../repositories/user.repository";
import {v4 as uuidv4} from "uuid";
import {Result} from "../types/result.type";
import {ResultCode} from "../models/common/common";

export class authService {
    static async resendConfirmationCode(email: string):Promise<Result> {
        const user = await UserQueryRepository.getByLoginOrEmail(email)
        if (!user) return {
            code: ResultCode.Error,
            errorMessage: {message: 'email doesnt exist', field: 'email'}
        }
        if (user.emailConfirmation.isConfirmed) return {
            code: ResultCode.Error,
            errorMessage: {message: 'email is already confirmed', field: 'email'}
        }
        if (!user) return {code:ResultCode.NotFound}
        const newConfirmationCode = uuidv4()
        const updateConfirmCode = await UserRepository.updateNewConfirmCode(user._id, newConfirmationCode)
        if (!updateConfirmCode) return {code:ResultCode.NotFound}
        const subject = "Email Confirmation"
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newConfirmationCode}'>complete registration</a>
        </p>`
        const sendCode = await emailAdapter.sendEmail(email, subject, message)
        if (!sendCode) return {code:ResultCode.NotFound}
        return {code:ResultCode.Success}
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

    static async confirmEmail(code: string): Promise<Result> {
        const user = await UserQueryRepository.getByCode(code)
        if (!user) return {code: ResultCode.Error, errorMessage: {message: 'code doesnt exist', field: 'code'}}
        if (user.emailConfirmation.expirationDate < new Date()) return {
            code: ResultCode.Error,
            errorMessage: {message: 'code is expiration', field: 'code'}
        }
        if (user.emailConfirmation.isConfirmed) return {
            code: ResultCode.Error,
            errorMessage: {message: 'code already confirmed', field: 'code'}
        }
        if (user.emailConfirmation.confirmationCode !== code) return {code: ResultCode.Error}
        const updateConfirm = await UserRepository.updateConfirmation(user._id)
        if (updateConfirm) return {code: ResultCode.Success}
        return {code: ResultCode.Error}
    }

    static async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UsersTypeDb> | null> {
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