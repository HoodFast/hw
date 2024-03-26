import mongoose from "mongoose";
import {CommentDbType, likesStatuses, likesType} from "./comment.db.model";
import {Result} from "../../../types/result.type";
import {ResultCode} from "../../common/common";

// const likesSchema = new mongoose.Schema<likesType>({
//     createdAt: Date,
//     updatedAt: Date,
//     userId: String,
//     likesStatus: {type: String, enum: likesStatuses}
// })

export const commentSchema = new mongoose.Schema<CommentDbType>({
    content: String,
    postId: {type: String, require},
    commentatorInfo: {
        userId: {type: String, require},
        userLogin: {type: String, require},
    },
    createdAt: String,
    likesCount: Number,
    dislikesCount: Number,
    likes: [{
        createdAt: Date,
        updatedAt: Date,
        userId: String,
        likesStatus: {type: String, enum: likesStatuses}
    }]
})
commentSchema.methods.addLike =
    async function (userId: string, likeStatus: likesStatuses): Promise<Result> {
        const likes: [likesType] = this.likes
        const myStatus = likes.find(i => i.userId === userId)
        const newLike: likesType = {
            createdAt: new Date(),
            updatedAt: new Date(),
            userId,
            likesStatus: likeStatus
        }

        if (!myStatus) {
            likes.push(newLike)
            this.likesCount = likes.filter(i => i.likesStatus === likesStatuses.like).length
            this.dislikesCount = likes.filter(i => i.likesStatus === likesStatuses.dislike).length

            return {code: ResultCode.Success}
        }

        if (myStatus.likesStatus === likeStatus) return {code: ResultCode.Success}

        myStatus.likesStatus = likeStatus
        myStatus.updatedAt = new Date()
        this.likesCount = likes.filter(i => i.likesStatus === likesStatuses.like).length
        this.dislikesCount = likes.filter(i => i.likesStatus === likesStatuses.dislike).length

        return {code: ResultCode.Success}
    }

commentSchema.methods.getMyStatus =
    function (userId: string): likesStatuses {
        const likes: [likesType] = this.likes
        const myStatus = likes.find(i => i.userId === userId)

        if (!myStatus) return likesStatuses.none

        return myStatus.likesStatus
    }

