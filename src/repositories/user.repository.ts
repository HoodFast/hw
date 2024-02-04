import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {usersCollection} from "../db/db";
import {UserQueryRepository} from "./users.query.repository";

export class UserRepository {
    static async createUser(data: UsersTypeDb) {
        const res = await usersCollection.insertOne(data)
        const user = UserQueryRepository.getById(res.insertedId.toString())
        if (!user) {
            return null
        }
        return user
    }
};

