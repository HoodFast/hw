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
exports.commentsRoute = void 0;
require("reflect-metadata");
const express_1 = require("express");
const common_1 = require("../models/common/common");
const mongodb_1 = require("mongodb");
const comment_query_repository_1 = require("../repositories/comment.query.repository");
const accesstoken_middleware_1 = require("../middlewares/auth/accesstoken-middleware");
const comments_service_1 = require("../services/comments.service");
const comments_validators_1 = require("../validators/comments-validators");
const likes_validator_1 = require("../validators/likes-validator");
const accesstoken_getId_1 = require("../middlewares/auth/accesstoken-getId");
const inversify_1 = require("inversify");
const composition_root_1 = require("../composition-root");
exports.commentsRoute = (0, express_1.Router)({});
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            let userId;
            if (!req.userId) {
                userId = '';
            }
            else {
                userId = req.userId.toString();
            }
            if (!mongodb_1.ObjectId.isValid(id))
                return res.sendStatus(404);
            const comment = yield comment_query_repository_1.CommentsQueryRepository.getById(new mongodb_1.ObjectId(id), userId);
            if (!comment)
                return res.sendStatus(404);
            return res.send(comment);
        });
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const userId = req.userId.toString();
            if (!mongodb_1.ObjectId.isValid(id))
                return res.sendStatus(404);
            const deleted = yield this.commentService.deleteCommentById(id, userId);
            switch (deleted.code) {
                case common_1.ResultCode.NotFound:
                    return res.sendStatus(404);
                case common_1.ResultCode.Forbidden:
                    return res.sendStatus(403);
                case common_1.ResultCode.Success:
                    return res.sendStatus(204);
                default:
                    return res.sendStatus(404);
            }
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const userId = req.userId.toString();
            if (!mongodb_1.ObjectId.isValid(id))
                return res.sendStatus(404);
            const updateComment = yield this.commentService.updateComment(id, req.body.content, userId);
            switch (updateComment.code) {
                case common_1.ResultCode.NotFound:
                    return res.sendStatus(404);
                case common_1.ResultCode.Forbidden:
                    return res.sendStatus(403);
                case common_1.ResultCode.Success:
                    return res.sendStatus(204);
                default:
                    return res.sendStatus(404);
            }
        });
    }
    updateLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId.toString();
            const commentId = req.params.id;
            const likeStatus = req.body.likeStatus;
            const updateLike = yield this.commentService.updateLike(userId, commentId, likeStatus);
            switch (updateLike.code) {
                case common_1.ResultCode.NotFound:
                    return res.sendStatus(404);
                case common_1.ResultCode.Forbidden:
                    return res.sendStatus(403);
                case common_1.ResultCode.Success:
                    return res.sendStatus(204);
                default:
                    return res.sendStatus(404);
            }
        });
    }
};
CommentController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentController);
const commentController = composition_root_1.container.resolve(CommentController);
exports.commentsRoute.get('/:id', accesstoken_getId_1.accessTokenGetId, commentController.getCommentById.bind(commentController));
exports.commentsRoute.delete('/:id', accesstoken_middleware_1.accessTokenGuard, commentController.deleteCommentById.bind(commentController));
exports.commentsRoute.put('/:id', accesstoken_middleware_1.accessTokenGuard, (0, comments_validators_1.commentsValidation)(), commentController.updateComment.bind(commentController));
exports.commentsRoute.put('/:id/like-status', accesstoken_middleware_1.accessTokenGuard, (0, likes_validator_1.likesValidators)(), commentController.updateLikes.bind(commentController));
