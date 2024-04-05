import {likesType} from "../../comments/db/comment.db.model";
import {UserQueryRepository} from "../../../repositories/users.query.repository";
import {ObjectId} from "mongodb";
import {postLikesType} from "../../../domain/posts/postsModel";


export type newestLikesType = {
    addedAt: string
    userId: string
    login: string
}
export const newestLikesMapper = (like: postLikesType): newestLikesType => {
    return {
        addedAt: like.updatedAt.toString(),
        userId: like.userId,
        login: like.login
    }
}