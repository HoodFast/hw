import {Request, Response} from "express";
import {likesStatuses} from "../comments/db/comment.db.model";
import {newestLikesType} from "../post/mappers/newestLikes.mapper";

export type ParamsType = { id: string }
export type ResponseType<R> = Response<R, {}>
export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithQueryAndParams<P,Q> = Request<P, {}, {}, Q>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>

export enum ResultCode  {
    Unauthorized='Unauthorized',
    Error='Error',
    Success='Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden'
}

export type Pagination<I> = {
    totalCount: number
    pagesCount: number
    page: number
    pageSize: number
    items: I[]
}

export type createPostFromBlog = {
    title:string
    shortDescription: string,
    content: string
}

export type CreatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}



export type PostTypeCreate = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    createdAt: string
}

export type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo:{
        likesCount:number,
        dislikesCount:number,
        myStatus:likesStatuses,
        newestLikes:newestLikesType[]
    }
}

export type UpdatePostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type OutputBlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type OutputBlogMapType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export type UpdateBlogType = {
    name: string
    description: string
    websiteUrl: string
}

export type ErrorType = {
    errorsMessages: ErrorMessagesType[]
}
export type ErrorMessagesType = {
    message: string
    field: string
}