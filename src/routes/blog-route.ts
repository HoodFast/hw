import "reflect-metadata"
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
    ResponseType, OutputBlogType, RequestWithQuery, Pagination, PostType, RequestWithQueryAndParams
} from "../models/common/common";
import {QueryBlogInputModel} from "../models/blog/input/query.blog.input.model";
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {createPostFromBlogValidation} from "../validators/post-validators";
import {CreatePostFromBlogInputModel} from "../models/blog/input/create.post.from.blog.input.model";
import {BlogService} from "../services/blog.service";

import {sortQueryFieldsUtil} from "../utils/sortQueryFields.util";
import {injectable} from "inversify";
import {container} from "../composition-root";




export const blogRoute = Router({})
@injectable()
export class BlogsController {
    constructor(
        protected blogService: BlogService,
        protected blogQueryRepository: BlogQueryRepository
    ) {
    }

    async createBlog(req: RequestWithBody<UpdateBlogType>, res: ResponseType<OutputBlogType>) {
        const newBlog = {
            name:req.body.name,
            description:req.body.description,
            websiteUrl:req.body.websiteUrl,
            createdAt:new Date().toISOString(),
            isMembership: false
        }
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
        let userId
        if(req.userId){userId = req.userId!.toString()}

        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return
        }

        const createPostFromBlogModel = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content
        }

        const post = await this.blogService.createPostToBlog(id, createPostFromBlogModel,userId)

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

        const blogs = await this.blogQueryRepository.getAll(sortData)
        res.send(blogs)
    }

    async getAllPostsToBlogId(req: RequestWithQueryAndParams<ParamsType, QueryBlogInputModel>, res: ResponseType<Pagination<PostType>>) {
        const id = req.params.id
        let userId
        if(req.userId){userId = req.userId!.toString()}
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return
        }
        const blog = await this.blogQueryRepository.getById(new ObjectId(id))
        if (!blog) {
            res.sendStatus(404)
            return
        }
        const {sortBy, sortDirection, pageNumber, pageSize} = req.query
        const sortData = sortQueryFieldsUtil({sortBy, sortDirection, pageNumber, pageSize})

        const posts = await this.blogQueryRepository.getAllPostsToBlog(id, sortData,userId)

        res.send(posts)
    }

    async getBlogById(req: RequestWithParams<{ id: string }>, res: ResponseType<OutputBlogType>) {
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return
        }
        const blog = await this.blogQueryRepository.getById(new ObjectId(req.params.id))
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

const blogsController = container.resolve<BlogsController>(BlogsController)

blogRoute.get('/', blogsController.getAllBlogs.bind(blogsController))
blogRoute.get('/:id/posts', blogsController.getAllPostsToBlogId.bind(blogsController))
blogRoute.get('/:id', blogsController.getBlogById.bind(blogsController))
blogRoute.post('/', authMiddleware, blogValidation(), blogsController.createBlog.bind(blogsController))
blogRoute.post('/:id/posts', authMiddleware, createPostFromBlogValidation(), blogsController.createPostToBlog.bind(blogsController))
blogRoute.put('/:id', authMiddleware, blogValidation(), blogsController.updateBlog.bind(blogsController))
blogRoute.delete('/:id', authMiddleware, blogsController.deleteBlogById.bind(blogsController))