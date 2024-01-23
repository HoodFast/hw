import {Router, Request, Response} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validators";
import {BlogRepository, OutputBlogType} from "../repositories/blog-repository";
import {ObjectId} from "mongodb";

export const blogRoute = Router({})
export type blogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export type updateBlogType = {
    name: string
    description: string
    websiteUrl: string
}
export type ParamsType = { id: string }
export type ResponseType<R> = Response<R, {}>
export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
blogRoute.get('/', async (req: Request, res: Response) => {
    const blogs = await BlogRepository.getAll()
    res.send(blogs)
})

blogRoute.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }
    const blog = await BlogRepository.getById(req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.send(blog)
})
blogRoute.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<updateBlogType>, res: ResponseType<OutputBlogType>) => {
    const {name, description, websiteUrl} = req.body

    const newBlog = {
        name,
        description,
        websiteUrl,
        isMembership: false,
        createdAt: new Date().toISOString()
    }

    const createBlog = await BlogRepository.createBlog(newBlog)
    if (!createBlog) {
        res.sendStatus(404)
        return
    }
    res.status(201).send(createBlog)
})

blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<
    ParamsType, updateBlogType>, res: ResponseType<void>) => {
    const id = req.params.id

    if (ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }
    const findUpdateBlog = await BlogRepository.getById(req.params.id)
    if (!findUpdateBlog) {
        res.sendStatus(404)
        return
    }

    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl


    const updateBlog = await BlogRepository.updateBlog({id, name, description, websiteUrl})

    if (!updateBlog) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const findBlog = await BlogRepository.getById(req.params.id)
    if (!findBlog) {
        res.sendStatus(404)
        return
    }
    const isDeleted = await BlogRepository.deleteById(req.params.id)

    if (!isDeleted) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})