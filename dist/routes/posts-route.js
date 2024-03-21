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
const comments_validators_1 = require("../validators/comments-validators");
const comments_service_1 = require("../services/comments.service");
const accesstoken_middleware_1 = require("../middlewares/auth/accesstoken-middleware");
const comment_query_repository_1 = require("../repositories/comment.query.repository");
const db_1 = require("../db/db");
exports.postRoute = (0, express_1.Router)({});
class PostController {
    constructor() {
        this.postService = new post_service_1.PostService();
        this.commentService = new comments_service_1.CommentsService();
        this.postQueryRepository = new post_query_repository_1.PostQueryRepository();
    }
    getAllPosts(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const sortData = {
                sortBy: (_a = req.query.sortBy) !== null && _a !== void 0 ? _a : 'createdAt',
                sortDirection: (_b = req.query.sortDirection) !== null && _b !== void 0 ? _b : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            };
            const blogs = yield this.postQueryRepository.getAll(sortData);
            if (!blogs) {
                res.sendStatus(404);
                return;
            }
            res.send(blogs);
        });
    }
    getPostBId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postQueryRepository.getById(new mongodb_1.ObjectId(req.params.id));
            if (!foundPost) {
                res.sendStatus(404);
                return;
            }
            res.send(foundPost);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
                createdAt: new Date().toISOString()
            };
            const post = yield this.postService.createPost(newPost);
            if (!post) {
                res.sendStatus(404);
                return;
            }
            res.status(201).send(post);
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {
                id: req.params.id,
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId
            };
            const updatePost = yield this.postService.updatePost(updateData);
            if (!updatePost) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(204);
        });
    }
    deletePostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongodb_1.ObjectId.isValid(id)) {
                res.sendStatus(404);
                return;
            }
            const deletePost = yield this.postService.deletePost(id);
            if (!deletePost) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(204);
        });
    }
    createCommentByPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createCommentData = {
                userId: req.userId.toString(),
                postId: req.params.id,
                content: req.body.content,
                createdAt: new Date().toISOString()
            };
            const createCommentToPost = yield this.commentService.createComment(createCommentData);
            if (!createCommentToPost) {
                res.sendStatus(404);
                return;
            }
            return res.status(201).send(createCommentToPost);
        });
    }
    getCommentsByPost(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongodb_1.ObjectId.isValid(id)) {
                res.sendStatus(404);
                return;
            }
            const post = yield db_1.postModel.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!post)
                return res.sendStatus(404);
            const sortData = {
                sortBy: (_a = req.query.sortBy) !== null && _a !== void 0 ? _a : 'createdAt',
                sortDirection: (_b = req.query.sortDirection) !== null && _b !== void 0 ? _b : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            };
            const comments = yield comment_query_repository_1.CommentsQueryRepository.getAllByPostId(id, sortData);
            if (!comments)
                return res.sendStatus(404);
            return res.send(comments);
        });
    }
}
const postController = new PostController();
exports.postRoute.get('/', postController.getAllPosts.bind(postController));
exports.postRoute.get('/:id', postController.getPostBId.bind(postController));
exports.postRoute.post('/', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), postController.createPost.bind(postController));
exports.postRoute.put('/:id', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), postController.updatePost.bind(postController));
exports.postRoute.delete('/:id', auth_middleware_1.authMiddleware, postController.deletePostById.bind(postController));
exports.postRoute.post('/:id/comments', accesstoken_middleware_1.accessTokenGuard, (0, comments_validators_1.commentsValidation)(), postController.createCommentByPost.bind(postController));
exports.postRoute.get('/:id/comments', postController.getCommentsByPost.bind(postController));
