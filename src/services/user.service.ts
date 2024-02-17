import {UserRepository} from "../repositories/user.repository";
import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {v4 as uuidv4} from 'uuid'

import {UserQueryRepository} from "../repositories/users.query.repository";
import {add} from "date-fns/add";
import {OutputUsersType} from "../models/users/output/output.users.models";
import {authService} from "./auth.service";


const bcrypt = require('bcrypt');
const saltRounds = 10;

export class userService {
    static async updateConfirmCode(){

    }
    static async createUser(login: string, email: string, password: string, isConfirmed?:boolean): Promise<OutputUsersType | null> {
        const createdAt = new Date().toISOString()
        const salt = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(password, salt)

        const userData: UsersTypeDb = {
            accountData: {_passwordHash: hash, createdAt, email, login},
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30
                }),
                isConfirmed: isConfirmed ? isConfirmed : false
            }
        }
        const createdUser = await UserRepository.createUser(userData)
        if (!createdUser) {
            return null
        }
        try {
             await authService.sendConfirmCode(createdUser.email)
        } catch (e) {
            console.log(e)
            return null
        }

        return createdUser
    }



    static async deleteUser(id: string): Promise<boolean | null> {
        const findUser = await UserQueryRepository.getById(id)
        if (!findUser) {
            return null
        }
        return await UserQueryRepository.deleteById(id)
    }
}