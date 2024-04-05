import mongoose, {HydratedDocument, Model} from "mongoose";
import { likesStatuses} from "../../models/comments/db/comment.db.model";
import {newestLikesMapper, newestLikesType} from "../../models/post/mappers/newestLikes.mapper";

export type postLikesType = {
    createdAt: Date,
    updatedAt: Date,
    login:string,
    userId: string,
    likesStatus: likesStatuses
}


export type PostTypeDb = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    likesCount: number
    dislikesCount: number
    likes:postLikesType[]
}

type postsMethodsType = {
    addLike: (userId: string, likeStatus: likesStatuses,login:string)=>boolean,
    getMyStatus:(userId: string)=>likesStatuses
    getNewestLikes:()=>newestLikesType[]
}
type postsModelType = Model<PostTypeDb,{},postsMethodsType>

export type PostSmart = HydratedDocument<PostTypeDb,postsMethodsType>
export const postSchema = new mongoose.Schema<PostTypeDb,postsModelType,postsMethodsType>({
    title: {type: String, require},
    shortDescription: {type: String, require},
    content: {type: String, require},
    blogId: {type: String, require},
    blogName: {type: String, require},
    createdAt: {type: String, require},
    likesCount: Number,
    dislikesCount: Number,
    likes: [{
        createdAt: Date,
        updatedAt: Date,
        login:String,
        userId: String,
        likesStatus: {type: String, enum: likesStatuses}
    }]
})

postSchema.methods.addLike =
    function (userId: string, likeStatus: likesStatuses, login:string): boolean {
        const likes: postLikesType[] = this.likes
        const myStatus = likes.find(i => i.userId === userId)
        const newLike: postLikesType = {
            createdAt: new Date(),
            updatedAt: new Date(),
            login,
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

postSchema.methods.getMyStatus =
    function (userId: string): likesStatuses {
        const likes: postLikesType[] = this.likes
        const myStatus = likes.find(i => i.userId === userId)

        if (!myStatus) return likesStatuses.none

        return myStatus.likesStatus
    }

postSchema.methods.getNewestLikes =
    function (): newestLikesType[]  {
        const likes: postLikesType[] = this.likes.filter(i=>i.likesStatus===likesStatuses.like
        )
        const sortLikes: postLikesType[] = likes.sort((a,b)=>{
            return a.updatedAt.getTime() - b.updatedAt.getTime()
        })
        return sortLikes.slice(0,2).map(newestLikesMapper)
    }

