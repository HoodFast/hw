import {ObjectId} from "mongodb";
import {CommentDbType} from "../models/comments/db/comment.db.model";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {CommentsQueryRepository} from "./comment.query.repository";
import {commentModel} from "../db/db";
import {injectable} from "inversify";

@injectable()
export class CommentRepository {
     async getCommentById(commentId:string){
         try {
             const res = await commentModel.findOne({_id:new ObjectId(commentId)})
             if (!res) {
                 return null
             }
             return res
         }catch (e){
             console.log(e)
             return null
         }

     }

    static async createComment(createData: CommentDbType): Promise<CommentsOutputType | null> {
        const res = await commentModel.insertMany(createData)
        const comment = await CommentsQueryRepository.getById(res[0]._id,res[0].commentatorInfo.userId)
        if (!comment) {
            return null
        }
        return comment
    }

    async updateComment(id: string, content: string): Promise<boolean> {

        const res = await commentModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content,
            }
        })
        return !!res.matchedCount
    }

    static async deleteById(id: string): Promise<boolean> {
        const res = await commentModel.deleteOne({_id: new ObjectId(id)})
        return !!res.deletedCount
    }
}