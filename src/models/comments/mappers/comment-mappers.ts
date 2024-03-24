import {WithId} from "mongodb";
import {CommentDbType, likesStatuses} from "../db/comment.db.model";
import {CommentsOutputType} from "../otput/comments.output.model";
import {CommentsQueryRepository} from "../../../repositories/comment.query.repository";
import {CommentRepository} from "../../../repositories/comment.repository";



export const commentMapper = (comment: WithId<CommentDbType>,userId:string): CommentsOutputType => {

    // @ts-ignore
    let myStatus = comment.getMyStatus(userId)

    if(!myStatus){
        myStatus=likesStatuses.none
    }
    return {
        id: comment._id.toString(),
        content:comment.content,
        commentatorInfo: {
            userId:comment.commentatorInfo.userId,
            userLogin:comment.commentatorInfo.userLogin
        },
        createdAt:comment.createdAt,
        likesInfo: {
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
            myStatus:myStatus
        }
    }
}