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
exports.commentsRoute = void 0;
const express_1 = require("express");
const common_1 = require("../models/common/common");
const mongodb_1 = require("mongodb");
const comment_query_repository_1 = require("../repositories/comment.query.repository");
const accesstoken_middleware_1 = require("../middlewares/auth/accesstoken-middleware");
const comments_service_1 = require("../services/comments.service");
const comments_validators_1 = require("../validators/comments-validators");
exports.commentsRoute = (0, express_1.Router)({});
exports.commentsRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id))
        return res.sendStatus(404);
    const comment = yield comment_query_repository_1.CommentsQueryRepository.getById(new mongodb_1.ObjectId(id));
    if (!comment)
        return res.sendStatus(404);
    return res.send(comment);
}));
exports.commentsRoute.delete('/:id', accesstoken_middleware_1.accessTokenGuard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userId = req.user.id;
    if (!mongodb_1.ObjectId.isValid(id))
        return res.sendStatus(404);
    const deleted = yield comments_service_1.CommentsService.deleteCommentById(id, userId);
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
}));
exports.commentsRoute.put('/:id', accesstoken_middleware_1.accessTokenGuard, (0, comments_validators_1.commentsValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userId = req.user.id;
    if (!mongodb_1.ObjectId.isValid(id))
        return res.sendStatus(404);
    const updateComment = yield comments_service_1.CommentsService.updateComment(id, req.body.content, userId);
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
}));
