import {ObjectId} from "mongodb";

export type CommentDbType = {
    content: string
    postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
    likesCount: number
    dislikesCount: number
    likes: likesType[]
}

export enum likesStatuses {
    none = 'None',
    like = 'Like',
    dislike = 'Dislike'
}

export type likesType = {
    createdAt: Date,
    updatedAt: Date,
    userId: string,
    likesStatus: likesStatuses
}

