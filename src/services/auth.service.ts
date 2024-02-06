import bcrypt from "bcrypt";
import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {UserRepository} from "../repositories/user.repository";
import {AuthInputType} from "../models/auth/input/auth.input.model";
import {UserQueryRepository} from "../repositories/users.query.repository";

export class authService {
    static async checkCredentials(data: AuthInputType): Promise<boolean> {
        const user = await UserQueryRepository.getByLoginOrEmail(data.loginOrEmail)
        if (!user) {
            return false
        }
        const res = bcrypt.compare(data.password, user._passwordHash)
        return res
    }
}