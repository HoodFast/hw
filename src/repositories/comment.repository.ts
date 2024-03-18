
import {ObjectId} from "mongodb";
import {CommentDbType} from "../models/comments/db/comment.db.model";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {CommentsQueryRepository} from "./comment.query.repository";
import {commentModel} from "../db/db";




export class CommentRepository {

    static async createComment(createData: CommentDbType):Promise<CommentsOutputType | null> {
        const res = await commentModel.insertMany(createData)
        const comment = await CommentsQueryRepository.getById(res[0]._id)
        if (!comment) {
            return null
        }
        return comment
    }

    static async updateComment(id:string,content:string):Promise<boolean> {

        const res = await commentModel.updateOne({_id:new ObjectId(id)}, {
            $set : {
                content,
            }
        })
        return !!res.matchedCount
    }

    static async deleteById(id: string):Promise<boolean> {
        const res = await commentModel.deleteOne({_id:new ObjectId(id)})
        return !!res.deletedCount
    }
}