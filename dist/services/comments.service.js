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
exports.CommentsService = void 0;
require("reflect-metadata");
const common_1 = require("../models/common/common");
const post_query_repository_1 = require("../repositories/post.query.repository");
const users_query_repository_1 = require("../repositories/users.query.repository");
const comment_repository_1 = require("../repositories/comment.repository");
const comment_query_repository_1 = require("../repositories/comment.query.repository");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
let CommentsService = class CommentsService {
    constructor(postQueryRepository, commentRepository) {
        this.postQueryRepository = postQueryRepository;
        this.commentRepository = commentRepository;
    }
    createComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, postId, content, createdAt } = data;
            const post = yield this.postQueryRepository.getById(new mongodb_1.ObjectId(postId), userId);
            if (!post) {
                return null;
            }
            const user = yield users_query_repository_1.UserQueryRepository.getById(new mongodb_1.ObjectId(userId));
            if (!user) {
                return null;
            }
            const newComment = {
                content,
                postId,
                commentatorInfo: {
                    userId,
                    userLogin: user.login
                },
                createdAt,
                likesCount: 0,
                dislikesCount: 0,
                likes: []
            };
            const createComment = yield comment_repository_1.CommentRepository.createComment(newComment);
            if (!createComment) {
                return null;
            }
            return createComment;
        });
    }
    updateComment(id, content, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentRepository.getCommentById(id);
            if (!comment)
                return { code: common_1.ResultCode.NotFound };
            const user = yield users_query_repository_1.UserQueryRepository.getById(new mongodb_1.ObjectId(userId));
            if (!user)
                return { code: common_1.ResultCode.NotFound };
            if (comment.commentatorInfo.userId !== user.id)
                return { code: common_1.ResultCode.Forbidden };
            const update = yield this.commentRepository.updateComment(id, content);
            if (!update)
                return { code: common_1.ResultCode.NotFound };
            return { code: common_1.ResultCode.Success };
        });
    }
    deleteCommentById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_query_repository_1.CommentsQueryRepository.getById(new mongodb_1.ObjectId(id), userId);
            if (!comment)
                return { code: common_1.ResultCode.NotFound };
            const user = yield users_query_repository_1.UserQueryRepository.getById(new mongodb_1.ObjectId(userId));
            if (!user)
                return { code: common_1.ResultCode.NotFound };
            if (comment.commentatorInfo.userId !== user.id)
                return { code: common_1.ResultCode.Forbidden };
            const deleted = yield comment_repository_1.CommentRepository.deleteById(id);
            if (!deleted)
                return { code: common_1.ResultCode.NotFound };
            return { code: common_1.ResultCode.Success };
        });
    }
    updateLike(userId, commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let comment = yield this.commentRepository.getCommentById(commentId);
                if (!comment) {
                    return { code: common_1.ResultCode.NotFound };
                }
                comment.addLike(userId, likeStatus);
                comment.save();
                return { code: common_1.ResultCode.Success };
            }
            catch (e) {
                return { code: common_1.ResultCode.Forbidden };
            }
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [post_query_repository_1.PostQueryRepository,
        comment_repository_1.CommentRepository])
], CommentsService);
