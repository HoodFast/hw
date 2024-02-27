import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {WithId} from "mongodb";
import {appConfig} from "../app/config";
import {UserRepository} from "../repositories/user.repository";
let jwt = require('jsonwebtoken');

export class jwtService {
    static async createJWT(user: WithId<UsersTypeDb>):Promise<string> {
        const token = jwt.sign({userId:user._id}, appConfig.AC_SECRET, {expiresIn:appConfig.AC_TIME})
        return token
    }


    static async createRefreshJWT(user: WithId<UsersTypeDb>):Promise<string> {
        const token = jwt.sign({userId:user._id}, appConfig.RT_SECRET, {expiresIn:appConfig.RT_TIME})
        return token
    }
    static async getUserIdByToken(token:string){
        try{
            const result = jwt.verify(token,appConfig.AC_SECRET)
            const blackList = await UserRepository.getBlackList(result.userId)
            if(blackList?.includes(token)) return null
            return result.userId
        }catch (err){
            return null
        }
    }

    static async getUserIdByRefreshToken(token:string){
        try{
            const result = jwt.verify(token,appConfig.RT_SECRET)
            const blackList = await UserRepository.getBlackList(result.userId)
            if(blackList?.includes(token)) return null
            return result.userId
        }catch (err){
            return null
        }
    }
}