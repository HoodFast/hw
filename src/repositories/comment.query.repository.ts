import {ObjectId} from "mongodb";
import {Pagination} from "../models/common/common";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {commentMapper} from "../models/comments/mappers/comment-mappers";
import {SortDataType} from "./blog.query.repository";
import {commentModel} from "../db/db";


export class CommentsQueryRepository {


    static async getById(id: ObjectId,userId:string) {
        const comment = await commentModel.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }

        return commentMapper(comment,userId)
    }

    static async getAllByPostId(id: string, sortData: SortDataType,userId:string):Promise<Pagination<CommentsOutputType> | null> {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData

        const comments = await commentModel
            .find({postId: id})
            .sort({sortBy: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)


        const totalCount = await commentModel.countDocuments({postId: id})
        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items:  comments.map(i=>commentMapper(i,userId))
        }
    }
}