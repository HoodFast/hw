import {UserRepository} from "../repositories/user.repository";
import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {BlogRepository} from "../repositories/blog.repository";
import {UserQueryRepository} from "../repositories/users.query.repository";


const bcrypt = require('bcrypt');
const saltRounds = 10;
export class userService  {
    static async createUser(login: string, email: string, password: string) {
        const createdAt = new Date().toISOString()
        const salt = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(password, salt)
        const data: UsersTypeDb = {_passwordHash: hash, createdAt, email, login}
        const createdUser = await UserRepository.createUser(data)
        if(!createdUser){
            return null
        }
        return createdUser
    }
    static async deleteUser(id:string) {
            const findUser = await UserQueryRepository.getById(id)
            if (!findUser) {
                return null
            }
            return await UserQueryRepository.deleteById(id)
    }
}