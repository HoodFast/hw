import {Request, Response, Router} from "express";
import {PostRepository} from "../repositories/post.repository";
import {postValidation} from "../validators/post-validators";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {
    createPostType, Pagination,
    ParamsType,
    PostType, PostTypeCreate,
    PostTypeDb, RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody, RequestWithQuery,
    ResponseType
} from "../models/common/common";
import {ObjectId} from "mongodb";
import {BlogQueryRepository, SortDataType} from "../repositories/blog.query.repository";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {QueryPostInputModel} from "../models/post/post.query.input.model";
import {PostService} from "../services/post.service";


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

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<createPostType>, res: ResponseType<PostType>) => {

    const newPost: PostTypeCreate = {
        title: req.body.title,
        shortDescription: '',
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


postRoute.put('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsAndBody<ParamsType, createPostType>, res: ResponseType<void>) => {

const updateData = {
    id:req.params.id,
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
