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
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {QueryParamsInputCommentType} from "../models/comments/input/qwery.comment.input.model";
import {accessTokenGuard} from "../middlewares/auth/accesstoken-middleware";
import {CommentRepository} from "../repositories/comment.repository";
import {CommentsQueryRepository} from "../repositories/comment.query.repository";
import {postsCollection} from "../db/db";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";


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


postRoute.post('/:id/comments', accessTokenGuard, commentsValidation(), async (req: RequestWithParamsAndBody<ParamsType, CreateCommentInputType>, res: ResponseType<CommentsOutputType>) => {


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
    return res.status(201).send(createCommentToPost)
})


postRoute.get('/:id/comments', async (req: RequestWithQueryAndParams<ParamsType, QueryParamsInputCommentType>, res: ResponseType<Pagination<CommentsOutputType>>) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }
    const post = await postsCollection.findOne({_id:new ObjectId(id)})

    if(!post) return res.sendStatus(404)

    const sortData = {
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }

    const comments = await CommentsQueryRepository.getAllByPostId(id,sortData)
    if(!comments) return res.sendStatus(404)

    return res.send(comments)
})