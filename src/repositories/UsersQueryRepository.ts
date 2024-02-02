import {usersCollection} from "../db/db";

import {Pagination, PostType} from "../models/common/common";
import {postMapper} from "../models/blog/mappers/post-mappers";
import {ObjectId} from "mongodb";
import {SortDataType} from "./blog.query.repository";


export class UserQueryRepository {
    static async getAll(sortData:SortDataType): Promise<Pagination<PostType>> {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData

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
            items: users.map(usersMapper)
        }
    }

    static async getById(id: string): Promise<PostType | null> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        if (!user) {
            return null
        }
        return postMapper(user)
    }

}