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
exports.BlogsController = exports.blogRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blog_validators_1 = require("../validators/blog-validators");
const mongodb_1 = require("mongodb");
const post_validators_1 = require("../validators/post-validators");
const sortQueryFields_util_1 = require("../utils/sortQueryFields.util");
const composition_root_1 = require("../../composition-root");
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
exports.blogRoute.get('/', composition_root_1.blogsController.getAllBlogs.bind(composition_root_1.blogsController));
exports.blogRoute.get('/:id/posts', composition_root_1.blogsController.getAllPostsToBlogId.bind(composition_root_1.blogsController));
exports.blogRoute.get('/:id', composition_root_1.blogsController.getBlogById.bind(composition_root_1.blogsController));
exports.blogRoute.post('/', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), composition_root_1.blogsController.createBlog.bind(composition_root_1.blogsController));
exports.blogRoute.post('/:id/posts', auth_middleware_1.authMiddleware, (0, post_validators_1.createPostFromBlogValidation)(), composition_root_1.blogsController.createPostToBlog.bind(composition_root_1.blogsController));
exports.blogRoute.put('/:id', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), composition_root_1.blogsController.updateBlog.bind(composition_root_1.blogsController));
exports.blogRoute.delete('/:id', auth_middleware_1.authMiddleware, composition_root_1.blogsController.deleteBlogById.bind(composition_root_1.blogsController));
