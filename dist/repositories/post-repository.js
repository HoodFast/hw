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
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_repository_1.BlogRepository.getById(data.blogId);
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
        });
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
