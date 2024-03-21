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
import {BlogDbType} from "../models/blog/db/blog-db";

export const blogRoute = Router({})

class BlogsController {
    private blogService: BlogService

    constructor() {
        this.blogService = new BlogService()
    }

    async createBlog(req: RequestWithBody<UpdateBlogType>, res: ResponseType<OutputBlogType>) {
        const newBlog = new BlogDbType(
            req.body.name,
            req.body.description,
            req.body.websiteUrl,
            new Date().toISOString(),
            false
        )
        const newBlog_ = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()
        }

        const createBlog = await this.blogService.createBlog(newBlog)
        if (!createBlog) {
            res.sendStatus(404)
            return
        }
        res.status(201).send(createBlog)
    }

    async updateBlog(req: RequestWithParamsAndBody<ParamsType, UpdateBlogType>, res: ResponseType<void>) {
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
        const updatedBlog = await this.blogService.updateBlog(id, updateBlogModel)

        if (!updatedBlog) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async createPostToBlog(req: RequestWithParamsAndBody<ParamsType, CreatePostFromBlogInputModel>, res: ResponseType<PostType>) {

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

        const post = await this.blogService.createPostToBlog(id, createPostFromBlogModel)

        if (!post) {
            res.sendStatus(404)
            return
        }

        res.status(201).send(post)
    }

    async getAllBlogs(req: RequestWithQuery<QueryBlogInputModel>, res: ResponseType<Pagination<OutputBlogType>>) {
        const sortData = {
            searchNameTerm: req.query.searchNameTerm ?? null,
            sortBy: req.query.sortBy ?? 'createdAt',
            sortDirection: req.query.sortDirection ?? 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10
        }

        const blogs = await BlogQueryRepository.getAll(sortData)
        res.send(blogs)
    }

    async getAllPostsToBlogId(req: RequestWithQueryAndParams<ParamsType, QueryBlogInputModel>, res: ResponseType<Pagination<PostType>>) {
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return
        }
        const blog = await BlogQueryRepository.getById(new ObjectId(id))
        if (!blog) {
            res.sendStatus(404)
            return
        }
        const {sortBy, sortDirection, pageNumber, pageSize} = req.query
        const sortData = sortQueryFieldsUtil({sortBy, sortDirection, pageNumber, pageSize})

        const posts = await BlogQueryRepository.getAllPostsToBlog(id, sortData)

        res.send(posts)
    }

    async getBlogById(req: RequestWithParams<{ id: string }>, res: ResponseType<OutputBlogType>) {
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return
        }
        const blog = await BlogQueryRepository.getById(new ObjectId(req.params.id))
        if (!blog) {
            res.sendStatus(404)
            return
        }
        res.send(blog)
    }

    async deleteBlogById(req: RequestWithParams<{ id: string }>, res: ResponseType<void>) {
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return
        }

        const blogIsDeleted = await this.blogService.deleteBlog(id)
        if (!blogIsDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }
}

const blogsController = new BlogsController()

blogRoute.get('/', blogsController.getAllBlogs.bind(blogsController))
blogRoute.get('/:id/posts', blogsController.getAllPostsToBlogId.bind(blogsController))
blogRoute.get('/:id', blogsController.getBlogById.bind(blogsController))
blogRoute.post('/', authMiddleware, blogValidation(), blogsController.createBlog.bind(blogsController))
blogRoute.post('/:id/posts', authMiddleware, createPostFromBlogValidation(), blogsController.createPostToBlog.bind(blogsController))
blogRoute.put('/:id', authMiddleware, blogValidation(), blogsController.updateBlog.bind(blogsController))
blogRoute.delete('/:id', authMiddleware, blogsController.deleteBlogById.bind(blogsController))