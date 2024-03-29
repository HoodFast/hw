import {UsersTypeDb} from "../models/users/db/usersDBModel";

import {UserQueryRepository} from "./users.query.repository";
import {ObjectId, WithId} from "mongodb";
import {userModel} from "../db/db";

export class UserRepository {
    static async createUser(data: UsersTypeDb) {
        const res = await userModel.insertMany(data)
        const user = UserQueryRepository.getById(res[0]._id)
        if (!user) {
            return null
        }
        return user
    }

    static async getUserById(id: string): Promise<WithId<UsersTypeDb> | null> {
        const res = await userModel.findOne({_id: new ObjectId(id)})
        if (!res) return null
        return res
    }


    static async recoveryPass(userId: ObjectId, hash: string){
        const res =await userModel.updateOne({_id: new ObjectId(userId)},{
            $set: {'accountData._passwordHash': hash}
        })
        return res.modifiedCount === 1
    }

    static async getBlackList(userId: string) {
        const res = await userModel.findOne({_id: new ObjectId(userId)})
        if (!res) return null
        return res.tokensBlackList
    }

    static async updateConfirmation(userId: ObjectId): Promise<boolean> {
        const res = await userModel.updateOne({_id: userId}, {
            $set: {
                "emailConfirmation.isConfirmed": true
            }
        })
        return res.modifiedCount === 1
    }

    static async updateNewConfirmCode(userId: ObjectId, code: string): Promise<boolean> {
        const res = await userModel.updateOne({_id: userId}, {
            $set: {
                "emailConfirmation.confirmationCode": code
            }
        })
        return res.modifiedCount === 1
    }

    static async doesExistById(id: string): Promise<boolean> {
        const res = await userModel.findOne({_id: new ObjectId(id)})
        return !!res
    }

    static async doesExistByLoginOrEmail(login: string, email: string) {
        const user = await userModel.findOne({$or: [{'accountData.email': email}, {'accountData.login': login}]})
        return !!user
    }
};

