import "reflect-metadata"
import {ResultCode} from "../models/common/common";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {UserQueryRepository} from "../repositories/users.query.repository";
import {CommentDbType, likesStatuses} from "../models/comments/db/comment.db.model";
import {CommentRepository} from "../repositories/comment.repository";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {CommentsQueryRepository} from "../repositories/comment.query.repository";
import {Result} from "../types/result.type";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";


export type CreateCommentDataType = {
    userId: string,
    postId: string,
    content: string,
    createdAt: string
}

@injectable()
export class CommentsService {


    constructor(
        protected postQueryRepository: PostQueryRepository,
        protected commentRepository: CommentRepository
    ) {


    }

    async createComment(data: CreateCommentDataType): Promise<CommentsOutputType | null> {
        const {userId, postId, content, createdAt} = data
        const post = await this.postQueryRepository.getById(new ObjectId(postId))

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
                userLogin: user.login
            },
            createdAt,
            likesCount: 0,
            dislikesCount: 0,
            likes: []
        }
        const createComment = await CommentRepository.createComment(newComment)
        if (!createComment) {
            return null
        }

        return createComment
    }

    async updateComment(id: string, content: string, userId: string): Promise<Result> {
        const comment = await this.commentRepository.getCommentById(id)

        if (!comment) return {code: ResultCode.NotFound}

        const user = await UserQueryRepository.getById(new ObjectId(userId))

        if (!user) return {code: ResultCode.NotFound}

        if (comment.commentatorInfo.userId !== user.id) return {code: ResultCode.Forbidden}

        const update = await this.commentRepository.updateComment(id, content)

        if (!update) return {code: ResultCode.NotFound}

        return {code: ResultCode.Success}
    }

    async deleteCommentById(id: string, userId: string): Promise<Result> {

        const comment = await CommentsQueryRepository.getById(new ObjectId(id), userId)

        if (!comment) return {code: ResultCode.NotFound}

        const user = await UserQueryRepository.getById(new ObjectId(userId))

        if (!user) return {code: ResultCode.NotFound}

        if (comment.commentatorInfo.userId !== user.id) return {code: ResultCode.Forbidden}

        const deleted = await CommentRepository.deleteById(id)

        if (!deleted) return {code: ResultCode.NotFound}

        return {code: ResultCode.Success}
    }

    async updateLike(userId: string, commentId: string, likeStatus: likesStatuses) {
        try {
            let comment = await this.commentRepository.getCommentById(commentId)
            if (!comment) {
                return {code: ResultCode.NotFound}
            }

            comment.addLike(userId, likeStatus)
            comment.save()

            return {code: ResultCode.Success}
        } catch (e) {

            return {code: ResultCode.Forbidden}
        }

    }

}