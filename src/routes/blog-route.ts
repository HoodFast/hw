import {Router} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validators";

import {ObjectId} from "mongodb";
import {
    ParamsType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    UpdateBlogType,
    ResponseType, OutputBlogType, RequestWithQuery, Pagination, PostTypeDb, PostType, RequestWithQueryAndParams
} from "../models/common/common";
import {QueryBlogInputModel} from "../models/blog/input/query.blog.input.model";
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {createPostFromBlogValidation} from "../validators/post-validators";
import {CreatePostFromBlogInputModel} from "../models/blog/input/create.post.from.blog.input.model";
import {BlogService} from "../services/blog.service";
import {BlogRepository} from "../repositories/blog.repository";
import {sortQueryFieldsUtil} from "../utils/sortQueryFields.util";

export const blogRoute = Router({})


blogRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res: ResponseType<Pagination<OutputBlogType>>) => {
    const sortData = {
        searchNameTerm: req.query.searchNameTerm ?? null,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }

    const blogs = await BlogQueryRepository.getAll(sortData)
    res.send(blogs)
})

blogRoute.get('/:id/posts', async (req: RequestWithQueryAndParams<ParamsType, QueryBlogInputModel>, res: ResponseType<Pagination<PostType>>) => {
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
    const {sortBy, sortDirection, pageNumber, pageSize} = req.query
    const sortData = sortQueryFieldsUtil({sortBy, sortDirection, pageNumber, pageSize})

    const posts = await BlogQueryRepository.getAllPostsToBlog(id, sortData)

    res.send(posts)
})

blogRoute.get('/:id', async (req: RequestWithParams<{ id: string }>, res: ResponseType<OutputBlogType>) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }
    const blog = await BlogQueryRepository.getById(req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.send(blog)
})
blogRoute.post('/', authMiddleware, blogValidation(),
    async (
        req: RequestWithBody<UpdateBlogType>,
        res: ResponseType<OutputBlogType>) => {

        const newBlog = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()
        }

        const createBlog = await BlogService.createBlog(newBlog)
        if (!createBlog) {
            res.sendStatus(404)
            return
        }
        res.status(201).send(createBlog)
    })

blogRoute.post('/:id/posts', authMiddleware, createPostFromBlogValidation(),
    async (
        req: RequestWithParamsAndBody<ParamsType, CreatePostFromBlogInputModel>,
        res: ResponseType<PostType>) => {

        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return
        }

        const createPostFromBlogModel = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content
        }

        const post = await BlogService.createPostToBlog(id, createPostFromBlogModel)

        if (!post) {
            res.sendStatus(404)
            return
        }

        res.status(201).send(post)
    })

blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<
    ParamsType, UpdateBlogType>, res: ResponseType<void>) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const updateBlogModel = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }
    const updatedBlog = await BlogService.updateBlog(id, updateBlogModel)

    if (!updatedBlog) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: ResponseType<void>) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const blogIsDeleted = await BlogService.deleteBlog(id)
    if (!blogIsDeleted) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})