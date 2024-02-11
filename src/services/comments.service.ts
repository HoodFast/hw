
import {UpdatePostType} from "../models/common/common";
import {PostRepository} from "../repositories/post.repository";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {UserQueryRepository} from "../repositories/users.query.repository";
import {CommentDbType} from "../models/comments/db/comment.db.model";
import {CommentRepository} from "../repositories/comment.repository";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";

export type CreateCommentDataType = {
    userId: string,
    postId: string,
    content: string,
    createdAt: string
}

export class CommentsService {
    static async createComment(data: CreateCommentDataType): Promise<CommentsOutputType | null> {
        const {userId, postId, content, createdAt} = data
        const post = await PostQueryRepository.getById(postId)

        if (!post) {
            return null
        }

        const user = await UserQueryRepository.getById(userId)

        if (!user) {
            return null
        }

        const newComment: CommentDbType = {
            content,
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

    static async updateComment(data: UpdatePostType): Promise<boolean | null> {
        return await PostRepository.updatePost(data)
    }

    static async deleteComment(id: string): Promise<boolean> {
        return await PostRepository.deletePost(id)
    }

}