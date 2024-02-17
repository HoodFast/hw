import bcrypt from "bcrypt";
import {UserQueryRepository} from "../repositories/users.query.repository";
import {WithId} from "mongodb";
import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {emailAdapter} from "../adapters/email.adapter";
import {UserRepository} from "../repositories/user.repository";
import {v4 as uuidv4} from "uuid";

export class authService {
    static async resendConfirmationCode(email:string) {
        const user = await UserQueryRepository.getByLoginOrEmail(email)
        if(!user) return false
        const newConfirmationCode= uuidv4()
        const updateConfirmCode = await UserRepository.updateNewConfirmCode(user._id, newConfirmationCode)
        if(!updateConfirmCode) return false
        const subject = "Email Confirmation"
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newConfirmationCode}'>complete registration</a>
        </p>`
        const sendCode = await emailAdapter.sendEmail(email, subject, message)
        if(!sendCode) return false
        return true
    }
    static async sendConfirmCode(email:string){
        const user = await UserQueryRepository.getByLoginOrEmail(email)
        if(!user) return false
        const subject = "Email Confirmation"
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>`
        const sendCode = await emailAdapter.sendEmail(email, subject, message)
        if(!sendCode) return false
        return true
    }

    static async confirmEmail(code: string): Promise<boolean> {
        const user = await UserQueryRepository.getByCode(code)
        if (!user) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false

        return await UserRepository.updateConfirmation(user._id)
    }

    static async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UsersTypeDb>|null> {
        const user = await UserQueryRepository.getByLoginOrEmail(loginOrEmail)
        if (!user) return null
        if(!user.emailConfirmation.isConfirmed) return null
        const res = await bcrypt.compare(password, user.accountData._passwordHash)
        if(!res){
            return null
        }else{
            return user
        }
    }
}