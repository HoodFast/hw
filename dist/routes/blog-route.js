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
const blog_repository_1 = require("../repositories/blog-repository");
const mongodb_1 = require("mongodb");
exports.blogRoute = (0, express_1.Router)({});
exports.blogRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_repository_1.BlogRepository.getAll();
    res.send(blogs);
}));
exports.blogRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const blog = yield blog_repository_1.BlogRepository.getById(req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    res.send(blog);
}));
exports.blogRoute.post('/', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const newBlog = {
        name,
        description,
        websiteUrl,
        isMembership: false,
        createdAt: new Date().toISOString()
    };
    const createBlog = yield blog_repository_1.BlogRepository.createBlog(newBlog);
    if (!createBlog) {
        res.sendStatus(404);
        return;
    }
    res.status(201).send(createBlog);
}));
exports.blogRoute.put('/:id', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const findUpdateBlog = yield blog_repository_1.BlogRepository.getById(req.params.id);
    if (!findUpdateBlog) {
        res.sendStatus(404);
        return;
    }
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    const updateBlog = yield blog_repository_1.BlogRepository.updateBlog({ id, name, description, websiteUrl });
    if (!updateBlog) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.blogRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.id)) {
        res.sendStatus(404);
        return;
    }
    const findBlog = yield blog_repository_1.BlogRepository.getById(req.params.id);
    if (!findBlog) {
        res.sendStatus(404);
        return;
    }
    const isDeleted = yield blog_repository_1.BlogRepository.deleteById(req.params.id);
    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
