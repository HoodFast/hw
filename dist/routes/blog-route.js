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
exports.blogRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blog_validators_1 = require("../validators/blog-validators");
const mongodb_1 = require("mongodb");
const blog_query_repository_1 = require("../repositories/blog.query.repository");
const post_validators_1 = require("../validators/post-validators");
const blog_service_1 = require("../services/blog.service");
const blog_repository_1 = require("../repositories/blog.repository");
exports.blogRoute = (0, express_1.Router)({});
exports.blogRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const sortData = {
        searchNameTerm: (_a = req.query.searchNameTerm) !== null && _a !== void 0 ? _a : null,
        sortBy: (_b = req.query.sortBy) !== null && _b !== void 0 ? _b : 'createdAt',
        sortDirection: (_c = req.query.sortDirection) !== null && _c !== void 0 ? _c : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    };
    const blogs = yield blog_query_repository_1.BlogQueryRepository.getAll(sortData);
    res.send(blogs);
}));
exports.blogRoute.get('/:id/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const blog = yield blog_repository_1.BlogRepository.getById(id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    const sortData = {
        sortBy: (_d = req.query.sortBy) !== null && _d !== void 0 ? _d : 'createdAt',
        sortDirection: (_e = req.query.sortDirection) !== null && _e !== void 0 ? _e : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    };
    const posts = yield blog_query_repository_1.BlogQueryRepository.getAllPostsToBlog(id, sortData);
    res.send(posts);
}));
exports.blogRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const blog = yield blog_query_repository_1.BlogQueryRepository.getById(req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    res.send(blog);
}));
exports.blogRoute.post('/', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        isMembership: false,
        createdAt: new Date().toISOString()
    };
    const createBlog = yield blog_service_1.BlogService.createBlog(newBlog);
    if (!createBlog) {
        res.sendStatus(404);
        return;
    }
    res.status(201).send(createBlog);
}));
exports.blogRoute.post('/:id/posts', auth_middleware_1.authMiddleware, (0, post_validators_1.createPostFromBlogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const post = yield blog_service_1.BlogService.createPostToBlog(id, createPostFromBlogModel);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.status(201).send(post);
}));
exports.blogRoute.put('/:id', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const updatedBlog = yield blog_service_1.BlogService.updateBlog(id, updateBlogModel);
    if (!updatedBlog) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.blogRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const blogIsDeleted = yield blog_service_1.BlogService.deleteBlog(id);
    if (!blogIsDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
