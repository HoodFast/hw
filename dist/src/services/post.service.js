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
exports.PostService = void 0;
const post_repository_1 = require("../repositories/post.repository");
const post_query_repository_1 = require("../repositories/post.query.repository");
const mongodb_1 = require("mongodb");
const blog_query_repository_1 = require("../repositories/blog.query.repository");
class PostService {
    constructor() {
        this.postQueryRepository = new post_query_repository_1.PostQueryRepository();
        this.blogQueryRepository = new blog_query_repository_1.BlogQueryRepository();
        this.postRepository = new post_repository_1.PostRepository();
    }
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, createdAt, blogId, content, shortDescription } = data;
            const blog = yield this.blogQueryRepository.getById(new mongodb_1.ObjectId(blogId));
            if (!blog) {
                return null;
            }
            const newPost = {
                title,
                content,
                shortDescription,
                blogId,
                blogName: blog.name,
                createdAt
            };
            const createPost = yield this.postRepository.createPost(newPost);
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
    updatePost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.updatePost(data);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.deletePost(id);
        });
    }
}
exports.PostService = PostService;
