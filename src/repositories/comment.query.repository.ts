import {blogsCollection, commentsCollection, postsCollection} from "../db/db";
import {blogMapper} from "../models/blog/mappers/blog-mappers";
import {ObjectId} from "mongodb";
import { OutputBlogMapType, OutputBlogType, Pagination, PostType} from "../models/common/common";
import {postMapper} from "../models/blog/mappers/post-mappers";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {commentMapper} from "../models/comments/mappers/comment-mappers";

export type SortDataSearchType = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}

export type SortDataType = {
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}


export class CommentsQueryRepository {

    static async getAllCommentsToPost(blogId: string, sortData: SortDataType): Promise<Pagination<PostType>> {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData

        const posts = await postsCollection
            .find({blogId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments({blogId})
        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }


    static async getById(id: string): Promise<CommentsOutputType | null> {
        const comment = await commentsCollection.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }
        return commentMapper(comment)
    }
}