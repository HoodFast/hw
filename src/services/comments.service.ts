import {ResultCode, UpdatePostType} from "../models/common/common";
import {PostRepository} from "../repositories/post.repository";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {UserQueryRepository} from "../repositories/users.query.repository";
import {CommentDbType} from "../models/comments/db/comment.db.model";
import {CommentRepository} from "../repositories/comment.repository";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {CommentsQueryRepository} from "../repositories/comment.query.repository";
import {Result} from "../types/result.type";
import {ObjectId} from "mongodb";

export type CreateCommentDataType = {
    userId: string,
    postId: string,
    content: string,
    createdAt: string
}

export class CommentsService {
    static async createComment(data: CreateCommentDataType): Promise<CommentsOutputType | null> {
        const {userId, postId, content, createdAt} = data
        const post = await PostQueryRepository.getById(new ObjectId(postId))

        if (!post) {
            return null
        }

        const user = await UserQueryRepository.getById(new ObjectId(userId))

        if (!user) {
            return null
        }

        const newComment: CommentDbType = {
            content,
            postId,
            commentatorInfo: {
                userId,
                userLogin:user.login
            },
            createdAt
        }
        const createComment = await CommentRepository.createComment(newComment)
        if (!createComment) {
            return null
        }

        return createComment
    }

    static async updateComment(id:string,content:string,userId:string): Promise<Result> {
        const comment = await CommentsQueryRepository.getById(new ObjectId(id))

        if (!comment) return {code: ResultCode.NotFound}

        const user = await UserQueryRepository.getById(new ObjectId(userId))

        if (!user) return {code: ResultCode.NotFound}

        if (comment.commentatorInfo.userId !== user.id) return {code: ResultCode.Forbidden}

        const update = await CommentRepository.updateComment(id,content)

        if (!update) return {code: ResultCode.NotFound}

        return {code: ResultCode.Success}
    }

    static async deleteCommentById(id: string,userId:string): Promise<Result> {

        const comment = await CommentsQueryRepository.getById(new ObjectId(id))

        if (!comment) return {code: ResultCode.NotFound}

        const user = await UserQueryRepository.getById(new ObjectId(userId))

        if (!user) return {code: ResultCode.NotFound}

        if (comment.commentatorInfo.userId !== user.id) return {code: ResultCode.Forbidden}

        const deleted = await CommentRepository.deleteById(id)

        if (!deleted) return {code: ResultCode.NotFound}

        return {code: ResultCode.Success}
    }

}