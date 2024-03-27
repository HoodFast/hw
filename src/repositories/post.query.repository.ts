import {postModel} from "../db/db";

import {Pagination, PostType} from "../models/common/common";
import {postMapper} from "../models/blog/mappers/post-mappers";
import {ObjectId} from "mongodb";
import {SortDataType} from "./blog.query.repository";
import {injectable} from "inversify";

@injectable()
export class PostQueryRepository {
    async getAll(sortData:SortDataType): Promise<Pagination<PostType>> {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData

        const posts = await postModel
            .find({})
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const totalCount = await postModel.countDocuments({})
        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }

     async getById(id: ObjectId): Promise<PostType | null> {
        const post = await postModel.findOne({_id: id})
        if (!post) {
            return null
        }
        return postMapper(post)
    }

}