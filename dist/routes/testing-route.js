"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRoute = void 0;
const express_1 = require("express");
const blog_repository_1 = require("../repositories/blog-repository");
const post_repository_1 = require("../repositories/post-repository");
exports.testingRoute = (0, express_1.Router)({});
exports.testingRoute.delete('/all-data', (req, res) => {
    blog_repository_1.BlogRepository.deleteBlogsAll();
    post_repository_1.PostRepository.deletePostAll();
    res.sendStatus(204);
});
