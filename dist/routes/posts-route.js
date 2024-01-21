"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoute = void 0;
const express_1 = require("express");
const post_repository_1 = require("../repositories/post-repository");
const post_validators_1 = require("../validators/post-validators");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
exports.postRoute = (0, express_1.Router)({});
exports.postRoute.get('/', (req, res) => {
    const blogs = post_repository_1.PostRepository.getAll();
    res.send(blogs);
});
exports.postRoute.get('/:id', (req, res) => {
    const foundPost = post_repository_1.PostRepository.getById(req.params.id);
    if (!foundPost) {
        res.sendStatus(404);
        return;
    }
    res.send(foundPost);
});
exports.postRoute.post('/', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => {
    const newPost = post_repository_1.PostRepository.createPost(req.body);
    res.send(newPost);
});
exports.postRoute.put('/:id', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => {
    const updatePost = post_repository_1.PostRepository.updatePost(Object.assign(Object.assign({}, req.body), { id: req.params.id }));
    if (!updatePost) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});
exports.postRoute.delete('/:id', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => {
    const deletePost = post_repository_1.PostRepository.deletePost(req.params.id);
    if (!deletePost) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});
