import {usersCollection} from "../db/db";
import {Pagination, PostType} from "../models/common/common";
import {ObjectId} from "mongodb";
import {SortDataType} from "./blog.query.repository";
import {OutputUsersType} from "../models/users/output/output.users.models";
import {userMapper} from "../models/users/mappers/user-mappers";


export type UserSortDataSearchType = {
    searchLoginTerm: string | null
    searchEmailTerm: string | null
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}



export class UserQueryRepository {
    static async getAll(sortData:UserSortDataSearchType): Promise<Pagination<OutputUsersType>> {
        const {searchLoginTerm,searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber} = sortData

        const users = await usersCollection
            .find({})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await usersCollection.countDocuments({})
        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(userMapper)
        }
    }

    static async getById(id: string): Promise<OutputUsersType | null> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        if (!user) {
            return null
        }
        return userMapper(user)
    }

}