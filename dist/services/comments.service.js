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
exports.CommentsService = void 0;
const common_1 = require("../models/common/common");
const post_query_repository_1 = require("../repositories/post.query.repository");
const users_query_repository_1 = require("../repositories/users.query.repository");
const comment_repository_1 = require("../repositories/comment.repository");
const comment_query_repository_1 = require("../repositories/comment.query.repository");
const mongodb_1 = require("mongodb");
class CommentsService {
    constructor() {
        this.postQueryRepository = new post_query_repository_1.PostQueryRepository();
    }
    createComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, postId, content, createdAt } = data;
            const post = yield this.postQueryRepository.getById(new mongodb_1.ObjectId(postId));
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
                createdAt
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
            const comment = yield comment_query_repository_1.CommentsQueryRepository.getById(new mongodb_1.ObjectId(id));
            if (!comment)
                return { code: common_1.ResultCode.NotFound };
            const user = yield users_query_repository_1.UserQueryRepository.getById(new mongodb_1.ObjectId(userId));
            if (!user)
                return { code: common_1.ResultCode.NotFound };
            if (comment.commentatorInfo.userId !== user.id)
                return { code: common_1.ResultCode.Forbidden };
            const update = yield comment_repository_1.CommentRepository.updateComment(id, content);
            if (!update)
                return { code: common_1.ResultCode.NotFound };
            return { code: common_1.ResultCode.Success };
        });
    }
    deleteCommentById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_query_repository_1.CommentsQueryRepository.getById(new mongodb_1.ObjectId(id));
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
}
exports.CommentsService = CommentsService;
