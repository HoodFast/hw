import {usersCollection} from "../db/db";
import {Pagination, PostType} from "../models/common/common";
import {ObjectId} from "mongodb";

import {OutputUsersType} from "../models/users/output/output.users.models";
import {userMapper} from "../models/users/mappers/user-mappers";
import {AuthInputType} from "../models/auth/input/auth.input.model";
import {UsersTypeDb} from "../models/users/db/usersDBModel";


export type UserSortDataSearchType = {
    searchLoginTerm: string | null
    searchEmailTerm: string | null
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}


export class UserQueryRepository {
    static async getAll(sortData: UserSortDataSearchType): Promise<Pagination<OutputUsersType>> {
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber} = sortData
        let loginFilter = {}
        let emailFilter = {}
        let filter = {}
        if (searchLoginTerm) {
            loginFilter = {
                login: {$regex: `^(?i)${searchLoginTerm}`, $options: 'i'}
            }
        }
        if (searchEmailTerm) {
            emailFilter = {
                email: {$regex: `^(?i)${searchEmailTerm}`, $options: 'i'}
            }
        }
        if (searchEmailTerm && searchLoginTerm) {
            filter = {$or: [loginFilter, emailFilter]}
        }else{
            filter = {$and: [loginFilter, emailFilter]}
        }


        const users = await usersCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await usersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(userMapper)
        }
    }

    static async getById(id: string):
        Promise<OutputUsersType | null> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        if (!
            user
        ) {
            return null
        }
        return userMapper(user)
    }

    static async getByLoginOrEmail(loginOrEmail: string):
        Promise<UsersTypeDb | null> {
        const user = await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
        if (!
            user
        ) {
            return null
        }
        return user
    }

}