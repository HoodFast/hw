import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {ObjectId, WithId} from "mongodb";
let jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '123'
export class jwtService {
    static async createJWT(user: WithId<UsersTypeDb>):Promise<string> {
        const token = jwt.sign({userId:user._id}, JWT_SECRET, {expiresIn:'1h'})
        return token
    }
    static async getUserByToken(token:string){
        try{
            const result = jwt.verify(token,JWT_SECRET)

            return result.userId
        }catch (err){
            return null
        }
    }
}