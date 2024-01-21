"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const db_1 = require("../db/db");
const blog_repository_1 = require("./blog-repository");
class PostRepository {
    static getAll() {
        return db_1.db.posts;
    }
    static getById(id) {
        const post = db_1.db.posts.find(p => p.id === id);
        return post;
    }
    static createPost(data) {
        const blog = blog_repository_1.BlogRepository.getById(data.blogId);
        if (!blog) {
            return;
        }
        const newPost = {
            id: String(+(new Date())),
            title: data.title,
            shortDescription: '',
            content: data.content,
            blogId: data.blogId,
            blogName: blog.name,
        };
        db_1.db.posts.push(newPost);
        return newPost;
    }
    static updatePost(data) {
        const foundPost = db_1.db.posts.find(p => p.id === data.id);
        if (foundPost) {
            foundPost.blogId = data.blogId;
            foundPost.content = data.content;
            foundPost.title = data.title;
            foundPost.shortDescription = data.shortDescription;
            return true;
        }
        return false;
    }
    static deletePost(id) {
        const foundPost = db_1.db.posts.find(p => p.id === id);
        if (!foundPost) {
            return false;
        }
        db_1.db.posts = db_1.db.posts.filter(p => p.id !== id);
        return true;
    }
    static deletePostAll() {
        db_1.db.posts = [];
        return;
    }
}
exports.PostRepository = PostRepository;
