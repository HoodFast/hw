import {Request, Response, Router} from "express";
import {PostRepository} from "../repositories/post-repository";
import {postValidation} from "../validators/post-validators";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {PostType, PostTypeDb, ResponseType} from "../models/common/common";
import {BlogRepository} from "../repositories/blog-repository";
import {ObjectId} from "mongodb";


export type createPostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithParamsSndBody<P, B> = Request<P, {}, B, {}>

export const postRoute = Router({})

postRoute.get('/', async (req: Request, res: Response) => {
    const blogs = await PostRepository.getAll()
    res.send(blogs)
})

postRoute.get('/:id', async (req: RequestWithParams<{ id: string }>, res: ResponseType<PostType>) => {
    const foundPost = await PostRepository.getById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
        return
    }
    res.send(foundPost)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<createPostType>, res: ResponseType<PostType>) => {
    const blog = await BlogRepository.getById(req.body.blogId)

    if (!blog) {
        res.sendStatus(404)
        return
    }

    const newPost: PostTypeDb = {
        title: req.body.title,
        shortDescription: '',
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blog.name,
        createdAt: new Date().toISOString()
    }

    const post = await PostRepository.createPost(newPost)

    if (!post) {
        res.sendStatus(404)
        return
    }
    res.status(201).send(post)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsSndBody<{
    id: string
}, createPostType>, res: ResponseType<void>) => {
    const updatePost = await PostRepository.updatePost({...req.body, id: req.params.id})
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

    const deletePost = await PostRepository.deletePost(id)
    if (!deletePost) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})
