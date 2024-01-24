import {Router, Request, Response} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validators";
import {BlogRepository} from "../repositories/blog-repository";
import {ObjectId} from "mongodb";
import {
    ParamsType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    UpdateBlogType,
    ResponseType, OutputBlogType
} from "../models/common/common";

export const blogRoute = Router({})


blogRoute.get('/', async (req: Request, res: ResponseType<OutputBlogType[]>) => {
    const blogs = await BlogRepository.getAll()
    res.send(blogs)
})

blogRoute.get('/:id', async (req: RequestWithParams<{ id: string }>, res: ResponseType<OutputBlogType>) => {
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
blogRoute.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<UpdateBlogType>, res: ResponseType<OutputBlogType>) => {
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
    ParamsType, UpdateBlogType>, res: ResponseType<void>) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
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

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: ResponseType<void>) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }

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