import {Response, Router} from "express";
import {postValidation} from "../validators/post-validators";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {
    CreatePostType, Pagination,
    ParamsType,
    PostType, PostTypeCreate,
    RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody, RequestWithQuery, RequestWithQueryAndParams,
    ResponseType
} from "../models/common/common";
import {ObjectId} from "mongodb";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {QueryPostInputModel} from "../models/post/post.query.input.model";
import {PostService} from "../services/post.service";
import {CreateCommentInputType} from "../models/comments/input/create.comment.input.model";
import {commentsValidation} from "../validators/comments-validators";
import {CommentsService, CreateCommentDataType} from "../services/comments.service";
import {QueryBlogInputModel} from "../models/blog/input/query.blog.input.model";
import {BlogRepository} from "../repositories/blog.repository";
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {blogRoute} from "./blog-route";
import {QueryParamsInputCommentType} from "../models/comments/input/qwery.comment.input.model";
import {accessTokenGuard} from "../middlewares/auth/accesstoken-middleware";


export const postRoute = Router({})

postRoute.get('/', async (req: RequestWithQuery<QueryPostInputModel>, res: ResponseType<Pagination<PostType>>) => {
    const sortData = {
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }

    const blogs = await PostQueryRepository.getAll(sortData)
    if (!blogs) {
        res.sendStatus(404)
        return
    }
    res.send(blogs)
})

postRoute.get('/:id', async (req: RequestWithParams<ParamsType>, res: ResponseType<PostType>) => {
    const foundPost = await PostQueryRepository.getById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
        return
    }
    res.send(foundPost)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<CreatePostType>, res: ResponseType<PostType>) => {

    const newPost: PostTypeCreate = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        createdAt: new Date().toISOString()
    }

    const post = await PostService.createPost(newPost)

    if (!post) {
        res.sendStatus(404)
        return
    }
    res.status(201).send(post)
})


postRoute.put('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsAndBody<ParamsType, CreatePostType>, res: ResponseType<void>) => {

    const updateData = {
        id: req.params.id,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    }
    const updatePost = await PostService.updatePost(updateData)
    if (!updatePost) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const deletePost = await PostService.deletePost(id)
    if (!deletePost) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})


postRoute.post('/:id/comments', accessTokenGuard, commentsValidation(), async (req: RequestWithParamsAndBody<ParamsType, CreateCommentInputType>, res: ResponseType<void>) => {

    const createCommentData:CreateCommentDataType = {
        userId:req.user!.id,
        postId : req.params.id,
        content : req.body.content,
        createdAt: new Date().toISOString()
    }

    const createCommentToPost = await CommentsService.createComment(createCommentData)
    if (!createCommentToPost) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})


postRoute.get('/:id/comments', async (req: RequestWithQueryAndParams<ParamsType, QueryParamsInputCommentType>, res: ResponseType<Pagination<PostType>>) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }
    const blog = await BlogRepository.getById(id)
    if(!blog){
        res.sendStatus(404)
        return
    }
    const sortData = {
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }

    const posts = await BlogQueryRepository.getAllPostsToBlog(id, sortData)

    res.send(posts)
})