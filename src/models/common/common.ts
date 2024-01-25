import {Request, Response} from "express";

export type ParamsType = { id: string }
export type ResponseType<R> = Response<R, {}>
export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithQueryAndParams<P,Q> = Request<P, {}, {}, Q>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>

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

export type createPostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type PostTypeDb = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
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