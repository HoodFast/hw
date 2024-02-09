import bcrypt from "bcrypt";
import {UserQueryRepository} from "../repositories/users.query.repository";
import {WithId} from "mongodb";
import {UsersTypeDb} from "../models/users/db/usersDBModel";

export class authService {
    static async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UsersTypeDb>|null> {
        const user = await UserQueryRepository.getByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null
        }
        const res = await bcrypt.compare(password, user._passwordHash)
        if(!res){
            return null
        }else{
            return user
        }
    }
}