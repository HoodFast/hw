"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsController = exports.BlogsController = exports.blogRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blog_validators_1 = require("../validators/blog-validators");
const mongodb_1 = require("mongodb");
const blog_query_repository_1 = require("../repositories/blog.query.repository");
const post_validators_1 = require("../validators/post-validators");
const blog_service_1 = require("../services/blog.service");
const sortQueryFields_util_1 = require("../utils/sortQueryFields.util");
const post_query_repository_1 = require("../repositories/post.query.repository");
const blog_repository_1 = require("../repositories/blog.repository");
const post_repository_1 = require("../repositories/post.repository");
// import {blogsController} from "../composition-root";
exports.blogRoute = (0, express_1.Router)({});
class BlogsController {
    constructor(blogService, blogQueryRepository) {
        this.blogService = blogService;
        this.blogQueryRepository = blogQueryRepository;
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const newBlog_ = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
                isMembership: false,
                createdAt: new Date().toISOString()
            };
            const createBlog = yield this.blogService.createBlog(newBlog);
            if (!createBlog) {
                res.sendStatus(404);
                return;
            }
            res.status(201).send(createBlog);
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongodb_1.ObjectId.isValid(id)) {
                res.sendStatus(404);
                return;
            }
            const updateBlogModel = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl
            };
            const updatedBlog = yield this.blogService.updateBlog(id, updateBlogModel);
            if (!updatedBlog) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(204);
        });
    }
    createPostToBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongodb_1.ObjectId.isValid(id)) {
                res.sendStatus(404);
                return;
            }
            const createPostFromBlogModel = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content
            };
            const post = yield this.blogService.createPostToBlog(id, createPostFromBlogModel);
            if (!post) {
                res.sendStatus(404);
                return;
            }
            res.status(201).send(post);
        });
    }
    getAllBlogs(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const sortData = {
                searchNameTerm: (_a = req.query.searchNameTerm) !== null && _a !== void 0 ? _a : null,
                sortBy: (_b = req.query.sortBy) !== null && _b !== void 0 ? _b : 'createdAt',
                sortDirection: (_c = req.query.sortDirection) !== null && _c !== void 0 ? _c : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            };
            const blogs = yield this.blogQueryRepository.getAll(sortData);
            res.send(blogs);
        });
    }
    getAllPostsToBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongodb_1.ObjectId.isValid(id)) {
                res.sendStatus(404);
                return;
            }
            const blog = yield this.blogQueryRepository.getById(new mongodb_1.ObjectId(id));
            if (!blog) {
                res.sendStatus(404);
                return;
            }
            const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
            const sortData = (0, sortQueryFields_util_1.sortQueryFieldsUtil)({ sortBy, sortDirection, pageNumber, pageSize });
            const posts = yield this.blogQueryRepository.getAllPostsToBlog(id, sortData);
            res.send(posts);
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongodb_1.ObjectId.isValid(id)) {
                res.sendStatus(404);
                return;
            }
            const blog = yield this.blogQueryRepository.getById(new mongodb_1.ObjectId(req.params.id));
            if (!blog) {
                res.sendStatus(404);
                return;
            }
            res.send(blog);
        });
    }
    deleteBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongodb_1.ObjectId.isValid(id)) {
                res.sendStatus(404);
                return;
            }
            const blogIsDeleted = yield this.blogService.deleteBlog(id);
            if (!blogIsDeleted) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(204);
        });
    }
}
exports.BlogsController = BlogsController;
const blogRepo = new blog_repository_1.BlogRepository();
const blogQueryRepository = new blog_query_repository_1.BlogQueryRepository();
const postRepository = new post_repository_1.PostRepository();
const postQueryRepository = new post_query_repository_1.PostQueryRepository();
const blogService = new blog_service_1.BlogService(blogRepo, blogQueryRepository, postRepository, postQueryRepository);
exports.blogsController = new BlogsController(blogService, blogQueryRepository);
exports.blogRoute.get('/', exports.blogsController.getAllBlogs.bind(exports.blogsController));
exports.blogRoute.get('/:id/posts', exports.blogsController.getAllPostsToBlogId.bind(exports.blogsController));
exports.blogRoute.get('/:id', exports.blogsController.getBlogById.bind(exports.blogsController));
exports.blogRoute.post('/', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), exports.blogsController.createBlog.bind(exports.blogsController));
exports.blogRoute.post('/:id/posts', auth_middleware_1.authMiddleware, (0, post_validators_1.createPostFromBlogValidation)(), exports.blogsController.createPostToBlog.bind(exports.blogsController));
exports.blogRoute.put('/:id', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), exports.blogsController.updateBlog.bind(exports.blogsController));
exports.blogRoute.delete('/:id', auth_middleware_1.authMiddleware, exports.blogsController.deleteBlogById.bind(exports.blogsController));
