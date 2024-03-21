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
exports.BlogService = void 0;
const blog_repository_1 = require("../repositories/blog.repository");
const post_repository_1 = require("../repositories/post.repository");
const post_query_repository_1 = require("../repositories/post.query.repository");
const blog_query_repository_1 = require("../repositories/blog.query.repository");
const mongodb_1 = require("mongodb");
class BlogService {
    constructor() {
        this.blogRepository = new blog_repository_1.BlogRepository();
        this.postQueryRepository = new post_query_repository_1.PostQueryRepository();
    }
    createPostToBlog(blogId, CreatePostData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, content, shortDescription } = CreatePostData;
            const blog = yield blog_query_repository_1.BlogQueryRepository.getById(new mongodb_1.ObjectId(blogId));
            if (!blog) {
                return null;
            }
            const newPost = {
                title,
                content,
                shortDescription,
                blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            const createPost = yield post_repository_1.PostRepository.createPost(newPost);
            if (!createPost) {
                return null;
            }
            const post = yield this.postQueryRepository.getById(new mongodb_1.ObjectId(createPost.id));
            if (!post) {
                return null;
            }
            return post;
        });
    }
    updateBlog(blogId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = updateData;
            const findUpdateBlog = yield blog_query_repository_1.BlogQueryRepository.getById(new mongodb_1.ObjectId(blogId));
            if (!findUpdateBlog) {
                return null;
            }
            return yield this.blogRepository.updateBlog(Object.assign({ id: blogId }, updateData));
        });
    }
    createBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createBlog = yield this.blogRepository.createBlog(data);
            if (!createBlog) {
                return null;
            }
            const blog = yield blog_query_repository_1.BlogQueryRepository.getById(new mongodb_1.ObjectId(createBlog.id));
            if (!blog) {
                return null;
            }
            return blog;
        });
    }
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBlog = yield blog_query_repository_1.BlogQueryRepository.getById(new mongodb_1.ObjectId(blogId));
            if (!findBlog) {
                return null;
            }
            return yield this.blogRepository.deleteById(blogId);
        });
    }
}
exports.BlogService = BlogService;
