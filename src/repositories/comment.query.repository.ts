import {commentsCollection, postsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {Pagination, PostType} from "../models/common/common";
import {postMapper} from "../models/blog/mappers/post-mappers";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {commentMapper} from "../models/comments/mappers/comment-mappers";
import {SortDataType} from "./blog.query.repository";


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

    static async getAllByPostId(id: string, sortData: SortDataType):Promise<Pagination<CommentsOutputType> | null> {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData

        const comments = await commentsCollection
            .find({postId: id})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await commentsCollection.countDocuments({postId: id})
        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items:  comments.map(commentMapper)
        }


    }
}