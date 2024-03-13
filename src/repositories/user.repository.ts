import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {usersCollection} from "../db/db";
import {UserQueryRepository} from "./users.query.repository";
import {ObjectId} from "mongodb";

export class UserRepository {
    static async createUser(data: UsersTypeDb) {
        const res = await usersCollection.insertOne(data)
        const user = UserQueryRepository.getById(res.insertedId.toString())
        if (!user) {
            return null
        }
        return user
    }
    static async getUserById(id:string){
        const res = await usersCollection.findOne({_id:new ObjectId(id)})
        if(!res)return null
        return res
    }

    static async putTokenInBL(userId: string, token: string) {
        const res = await usersCollection.updateOne({_id: new ObjectId(userId)}, {
            $push: {tokensBlackList: token}
        })
        return res.modifiedCount === 1
    }

    static async getBlackList(userId: string) {
        const res = await usersCollection.findOne({_id: new ObjectId(userId)})
        if (!res) return null
        return res.tokensBlackList
    }

    static async updateConfirmation(userId: ObjectId): Promise<boolean> {
        const res = await usersCollection.updateOne({_id: userId}, {
            $set: {
                "emailConfirmation.isConfirmed": true
            }
        })
        return res.modifiedCount === 1
    }

    static async updateNewConfirmCode(userId: ObjectId, code: string): Promise<boolean> {
        const res = await usersCollection.updateOne({_id: userId}, {
            $set: {
                "emailConfirmation.confirmationCode": code
            }
        })
        return res.modifiedCount === 1
    }

    static async doesExistById(id: string): Promise<boolean> {
        const res = await usersCollection.findOne({_id: new ObjectId(id)})
        return !!res
    }

    static async doesExistByLoginOrEmail(login: string, email: string) {
        const user = await usersCollection.findOne({$or: [{'accountData.email': email}, {'accountData.login': login}]})
        return !!user
    }
};

