"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const inversify_1 = require("inversify");
let BlogService = class BlogService {
    constructor(blogRepository, blogQueryRepository, postRepository, postQueryRepository) {
        this.blogRepository = blogRepository;
        this.blogQueryRepository = blogQueryRepository;
        this.postRepository = postRepository;
        this.postQueryRepository = postQueryRepository;
    }
    createPostToBlog(blogId, CreatePostData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, content, shortDescription } = CreatePostData;
            const blog = yield this.blogQueryRepository.getById(new mongodb_1.ObjectId(blogId));
            if (!blog) {
                return null;
            }
            const newPost = {
                title,
                content,
                shortDescription,
                blogId,
                likesCount: 0,
                dislikesCount: 0,
                blogName: blog.name,
                createdAt: new Date().toISOString(),
                likes: []
            };
            const createPost = yield this.postRepository.createPost(newPost);
            if (!createPost) {
                return null;
            }
            const post = yield this.postQueryRepository.getById(new mongodb_1.ObjectId(createPost.id), userId);
            if (!post) {
                return null;
            }
            return post;
        });
    }
    updateBlog(blogId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = updateData;
            const findUpdateBlog = yield this.blogQueryRepository.getById(new mongodb_1.ObjectId(blogId));
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
            const blog = yield this.blogQueryRepository.getById(new mongodb_1.ObjectId(createBlog.id));
            if (!blog) {
                return null;
            }
            return blog;
        });
    }
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBlog = yield this.blogQueryRepository.getById(new mongodb_1.ObjectId(blogId));
            if (!findBlog) {
                return null;
            }
            return yield this.blogRepository.deleteById(blogId);
        });
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blog_repository_1.BlogRepository,
        blog_query_repository_1.BlogQueryRepository,
        post_repository_1.PostRepository,
        post_query_repository_1.PostQueryRepository])
], BlogService);
