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

    static async doesExistById(id:string) :Promise<boolean>{
        const res = await usersCollection.findOne({_id:new ObjectId(id)})
        return !!res
    }
};

