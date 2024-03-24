import {likesStatuses} from "../db/comment.db.model";

export type CommentsOutputType = {
    id:string
    content:string
    commentatorInfo: {
        userId:string
        userLogin:string
    },
    createdAt:string
    likesInfo:{
        likesCount: number
        dislikesCount: number
        myStatus: likesStatuses
    }
}