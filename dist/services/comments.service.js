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
const post_repository_1 = require("../repositories/post.repository");
const post_query_repository_1 = require("../repositories/post.query.repository");
const users_query_repository_1 = require("../repositories/users.query.repository");
const comment_repository_1 = require("../repositories/comment.repository");
class CommentsService {
    static createComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, postId, content, createdAt } = data;
            const post = yield post_query_repository_1.PostQueryRepository.getById(postId);
            if (!post) {
                return null;
            }
            const user = yield users_query_repository_1.UserQueryRepository.getById(userId);
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
    static updateComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_repository_1.PostRepository.updatePost(data);
        });
    }
    static deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_repository_1.PostRepository.deletePost(id);
        });
    }
}
exports.CommentsService = CommentsService;
