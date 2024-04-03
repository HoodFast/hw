import {Response, Router} from "express";
import {postValidation} from "../validators/post-validators";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {
    CreatePostType, Pagination,
    ParamsType,
    PostType, PostTypeCreate,
    RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody, RequestWithQuery, RequestWithQueryAndParams,
    ResponseType, ResultCode
} from "../models/common/common";
import {ObjectId} from "mongodb";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {QueryPostInputModel} from "../models/post/post.query.input.model";
import {PostService} from "../services/post.service";
import {CreateCommentInputType} from "../models/comments/input/create.comment.input.model";
import {commentsValidation} from "../validators/comments-validators";
import {CommentsService, CreateCommentDataType} from "../services/comments.service";
import {QueryParamsInputCommentType} from "../models/comments/input/qwery.comment.input.model";
import {accessTokenGuard} from "../middlewares/auth/accesstoken-middleware";
import {CommentsQueryRepository} from "../repositories/comment.query.repository";

import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {postModel} from "../db/db";
import {injectable} from "inversify";
import {container} from "../composition-root";
import {likesValidators} from "../validators/likes-validator";
import {likesStatuses} from "../models/comments/db/comment.db.model";
import {accessTokenGetId} from "../middlewares/auth/accesstoken-getId";


export const postRoute = Router({})

@injectable()
class PostController {


    constructor(private commentService: CommentsService,
                private postService: PostService,
                private postQueryRepository: PostQueryRepository) {
    }

    async getAllPosts(req: RequestWithQuery<QueryPostInputModel>, res: ResponseType<Pagination<PostType>>) {
        const sortData = {
            sortBy: req.query.sortBy ?? 'createdAt',
            sortDirection: req.query.sortDirection ?? 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10
        }
        let userId
        if(req.userId) {
            userId = req.userId!.toString()
        }

        const blogs = await this.postQueryRepository.getAll(sortData, userId)
        if (!blogs) {
            res.sendStatus(404)
            return
        }
        res.send(blogs)
    }

    async getPostById(req: RequestWithParams<ParamsType>, res: ResponseType<PostType>) {
        let userId
        if( req.userId){
            userId = req.userId.toString()
        }

        const foundPost = await this.postQueryRepository.getById(new ObjectId(req.params.id), userId)
        if (!foundPost) {
            res.sendStatus(404)
            return
        }
        res.send(foundPost)
    }

    async createPost(req: RequestWithBody<CreatePostType>, res: ResponseType<PostType>) {


        const newPost: PostTypeCreate = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            createdAt: new Date().toISOString()
        }

        const post = await this.postService.createPost(newPost)

        if (!post) {
            res.sendStatus(404)
            return
        }
        res.status(201).send(post)
    }

    async updatePost(req: RequestWithParamsAndBody<ParamsType, CreatePostType>, res: ResponseType<void>) {

        const updateData = {
            id: req.params.id,
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        }
        const updatePost = await this.postService.updatePost(updateData)
        if (!updatePost) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async deletePostById(req: RequestWithParams<{ id: string }>, res: Response) {
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return
        }

        const deletePost = await this.postService.deletePost(id)
        if (!deletePost) {
            res.sendStatus(404)
            return
        }

        res.sendStatus(204)
    }

    async createCommentByPost(req: RequestWithParamsAndBody<ParamsType, CreateCommentInputType>, res: ResponseType<CommentsOutputType>) {
        const createCommentData: CreateCommentDataType = {
            userId: req.userId!.toString(),
            postId: req.params.id,
            content: req.body.content,
            createdAt: new Date().toISOString()
        }

        const createCommentToPost = await this.commentService.createComment(createCommentData)
        if (!createCommentToPost) {
            res.sendStatus(404)
            return
        }
        return res.status(201).send(createCommentToPost)
    }

    async getCommentsByPost(req: RequestWithQueryAndParams<ParamsType, QueryParamsInputCommentType>, res: ResponseType<Pagination<CommentsOutputType>>) {
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return
        }
        const post = await postModel.findOne({_id: new ObjectId(id)})
        const userId = req.userId ? req.userId.toString() : ''
        if (!post) return res.sendStatus(404)

        const sortData = {
            sortBy: req.query.sortBy ?? 'createdAt',
            sortDirection: req.query.sortDirection ?? 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10
        }

        const comments = await CommentsQueryRepository.getAllByPostId(id, sortData, userId)
        if (!comments) return res.sendStatus(404)

        return res.send(comments)
    }

    async updateLikes(req: RequestWithParamsAndBody<ParamsType, { likeStatus: likesStatuses }>, res: Response) {
        const userId = req.userId!.toString()
        const postId = req.params.id
        const likeStatus = req.body.likeStatus
        const updateLike = await this.postService.updateLike(userId, postId, likeStatus)
        switch (updateLike.code) {
            case ResultCode.NotFound:
                return res.sendStatus(404)
            case ResultCode.Forbidden:
                return res.sendStatus(403)
            case ResultCode.Success:
                return res.sendStatus(204)
            default:
                return res.sendStatus(404)
        }
    }
}

const postController = container.resolve<PostController>(PostController)

postRoute.get('/',accessTokenGetId, postController.getAllPosts.bind(postController))
postRoute.get('/:id',accessTokenGetId, postController.getPostById.bind(postController))
postRoute.post('/', authMiddleware, postValidation(), postController.createPost.bind(postController))
postRoute.put('/:id', authMiddleware, postValidation(), postController.updatePost.bind(postController))
postRoute.delete('/:id', authMiddleware, postController.deletePostById.bind(postController))
postRoute.post('/:id/comments', accessTokenGuard, commentsValidation(), postController.createCommentByPost.bind(postController))
postRoute.get('/:id/comments', accessTokenGuard, postController.getCommentsByPost.bind(postController))
postRoute.put('/:id/like-status', accessTokenGuard, likesValidators(), postController.updateLikes.bind(postController))