import {WithId} from "mongodb";
import {CommentDbType} from "../db/comment.db.model";
import {CommentsOutputType} from "../otput/comments.output.model";



export const commentMapper = (comment: WithId<CommentDbType>): CommentsOutputType => {

    return {
        id: comment._id.toString(),
        content:comment.content,
        commentatorInfo: {
            userId:comment.commentatorInfo.userId,
            userLogin:comment.commentatorInfo.userLogin
        },
        createdAt:comment.createdAt
    }
}