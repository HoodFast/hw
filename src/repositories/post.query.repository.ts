import {postsCollection} from "../db/db";

import {Pagination, PostType} from "../models/common/common";
import {postMapper} from "../models/blog/mappers/post-mappers";
import {ObjectId} from "mongodb";
import {SortDataType} from "./blog.query.repository";


export class PostQueryRepository {
    static async getAll(sortData:SortDataType): Promise<Pagination<PostType>> {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData

        const posts = await postsCollection
            .find({})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments({})
        const pageCount = Math.ceil(totalCount / pageSize)

        return {
            totalCount,
            pageCount,
            page: pageNumber,
            pageSize,
            items: posts.map(postMapper)
        }
    }

    static async getById(id: string): Promise<PostType | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return null
        }
        return postMapper(post)
    }

}