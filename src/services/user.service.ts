import {UserRepository} from "../repositories/user.repository";
import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {v4 as uuidv4} from 'uuid'

import {UserQueryRepository} from "../repositories/users.query.repository";
import {add} from "date-fns/add";
import {Result} from "../types/result.type";
import {ResultCode} from "../models/common/common";
import {OutputUsersType} from "../models/users/output/output.users.models";
import {ObjectId} from "mongodb";
import {AuthService} from "./auth.service";



const bcrypt = require('bcrypt');
const saltRounds = 10;

export class UserService {

    static async createUser(login: string, email: string, password: string, isConfirmed?: boolean): Promise<Result<OutputUsersType>> {
        const user = await UserRepository.doesExistByLoginOrEmail(login, email)

        if (user) return {code: ResultCode.Forbidden}
        const createdAt = new Date()
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
            },
            tokensBlackList: []
        }
        const createdUser = await UserRepository.createUser(userData)
        if (!createdUser) {
            return {code: ResultCode.NotFound}
        }
        try {
            if (!isConfirmed) {
                await AuthService.sendConfirmCode(createdUser.email)
            }
        } catch (e) {
            return {code: ResultCode.NotFound}
        }

        return {code: ResultCode.Success, data: createdUser}
    }


    static async deleteUser(id: string): Promise<boolean | null> {
        const findUser = await UserQueryRepository.getById(new ObjectId(id))
        if (!findUser) {
            return null
        }
        return await UserQueryRepository.deleteById(id)
    }

    static async recoveryPass(id:ObjectId,newPass:string){
        const salt = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(newPass, salt)
        const recover = await UserRepository.recoveryPass(id,hash)
        if(!recover) return {code: ResultCode.NotFound}
        return {code: ResultCode.Success}
    }
}