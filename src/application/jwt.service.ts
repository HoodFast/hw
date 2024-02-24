import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {WithId} from "mongodb";
import {appConfig} from "../app/config";
let jwt = require('jsonwebtoken');

export class jwtService {
    static async createJWT(user: WithId<UsersTypeDb>):Promise<string> {
        const token = jwt.sign({userId:user._id}, appConfig.AC_SECRET, {expiresIn:appConfig.AC_TIME})
        return token
    }
    static async getUserIdByToken(token:string){
        try{
            const result = jwt.verify(token,appConfig.AC_SECRET)

            return result.userId
        }catch (err){
            return null
        }
    }
}