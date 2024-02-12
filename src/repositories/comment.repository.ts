import {commentsCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {BlogType} from "../models/common/common";
import {CommentDbType} from "../models/comments/db/comment.db.model";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {CommentsQueryRepository} from "./comment.query.repository";
import {commentMapper} from "../models/comments/mappers/comment-mappers";



export class CommentRepository {

    static async createComment(createData: CommentDbType):Promise<CommentsOutputType | null> {
        const res = await commentsCollection.insertOne(createData)
        const comment = await CommentsQueryRepository.getById(res.insertedId.toString())
        if (!comment) {
            return null
        }
        return comment
    }

    static async updateBlog(data: BlogType):Promise<boolean> {

        const res = await commentsCollection.updateOne({_id:new ObjectId(data.id)}, {
            $set : {
                name:data.name,
                description:data.description,
                websiteUrl:data.websiteUrl
            }
        })
        return !!res.matchedCount
    }

    static async deleteById(id: string):Promise<boolean> {
        const res = await commentsCollection.deleteOne({_id:new ObjectId(id)})
        return !!res.deletedCount
    }
}