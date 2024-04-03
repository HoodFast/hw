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
exports.PostService = void 0;
const common_1 = require("../models/common/common");
const post_repository_1 = require("../repositories/post.repository");
const post_query_repository_1 = require("../repositories/post.query.repository");
const mongodb_1 = require("mongodb");
const blog_query_repository_1 = require("../repositories/blog.query.repository");
const inversify_1 = require("inversify");
const user_repository_1 = require("../repositories/user.repository");
let PostService = class PostService {
    constructor(postQueryRepository, blogQueryRepository, postRepository) {
        this.postQueryRepository = postQueryRepository;
        this.blogQueryRepository = blogQueryRepository;
        this.postRepository = postRepository;
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
                likesCount: 0,
                dislikesCount: 0,
                blogName: blog.name,
                createdAt,
                likes: []
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
    updateLike(userId, postId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post = yield this.postRepository.getPostById(postId);
                if (!post)
                    return { code: common_1.ResultCode.NotFound };
                const user = yield user_repository_1.UserRepository.getUserById(userId);
                if (!user)
                    return { code: common_1.ResultCode.NotFound };
                post.addLike(userId, likeStatus, user === null || user === void 0 ? void 0 : user.accountData.login);
                yield post.save();
                return { code: common_1.ResultCode.Success };
            }
            catch (e) {
                return { code: common_1.ResultCode.Forbidden };
            }
        });
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [post_query_repository_1.PostQueryRepository,
        blog_query_repository_1.BlogQueryRepository,
        post_repository_1.PostRepository])
], PostService);
