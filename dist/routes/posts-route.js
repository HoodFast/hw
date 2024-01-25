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
exports.postRoute = void 0;
const express_1 = require("express");
const post_validators_1 = require("../validators/post-validators");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const mongodb_1 = require("mongodb");
const post_query_repository_1 = require("../repositories/post.query.repository");
const post_service_1 = require("../services/post.service");
exports.postRoute = (0, express_1.Router)({});
exports.postRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const sortData = {
        sortBy: (_a = req.query.sortBy) !== null && _a !== void 0 ? _a : 'createdAt',
        sortDirection: (_b = req.query.sortDirection) !== null && _b !== void 0 ? _b : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    };
    const blogs = yield post_query_repository_1.PostQueryRepository.getAll(sortData);
    if (!blogs) {
        res.sendStatus(404);
        return;
    }
    res.send(blogs);
}));
exports.postRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield post_query_repository_1.PostQueryRepository.getById(req.params.id);
    if (!foundPost) {
        res.sendStatus(404);
        return;
    }
    res.send(foundPost);
}));
exports.postRoute.post('/', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = {
        title: req.body.title,
        shortDescription: '',
        content: req.body.content,
        blogId: req.body.blogId,
        createdAt: new Date().toISOString()
    };
    const post = yield post_service_1.PostService.createPost(newPost);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.status(201).send(post);
}));
exports.postRoute.put('/:id', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = {
        id: req.params.id,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    };
    const updatePost = yield post_service_1.PostService.updatePost(updateData);
    if (!updatePost) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.postRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const deletePost = yield post_service_1.PostService.deletePost(id);
    if (!deletePost) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
