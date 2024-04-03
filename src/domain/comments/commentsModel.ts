import mongoose, {Model} from "mongoose";
import {CommentDbType, likesStatuses, likesType} from "../../models/comments/db/comment.db.model";


// const likesSchema = new mongoose.Schema<likesType>({
//     createdAt: Date,
//     updatedAt: Date,
//     userId: String,
//     likesStatus: {type: String, enum: likesStatuses}
// })

type commentMethodsType = {
    addLike: (userId: string, likeStatus: likesStatuses) => boolean,
    getMyStatus: (userId: string) => likesStatuses
}
type commentsModelType = Model<CommentDbType, {}, commentMethodsType>
export const commentSchema = new mongoose.Schema<CommentDbType, commentsModelType, commentMethodsType>({
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
    function (userId: string, likeStatus: likesStatuses): boolean {
        const likes: likesType[] = this.likes
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

            return true
        }

        if (myStatus.likesStatus === likeStatus) return true

        myStatus.likesStatus = likeStatus
        myStatus.updatedAt = new Date()
        this.likesCount = likes.filter(i => i.likesStatus === likesStatuses.like).length
        this.dislikesCount = likes.filter(i => i.likesStatus === likesStatuses.dislike).length

        return true
    }

commentSchema.methods.getMyStatus =
    function (userId: string): likesStatuses {
        const likes: likesType[] = this.likes
        const myStatus = likes.find(i => i.userId === userId)

        if (!myStatus) return likesStatuses.none

        return myStatus.likesStatus
    }

