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
exports.CommentsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const comment_mappers_1 = require("../models/comments/mappers/comment-mappers");
const db_1 = require("../db/db");
class CommentsQueryRepository {
    static getById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.commentModel.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!comment) {
                return null;
            }
            return (0, comment_mappers_1.commentMapper)(comment, userId);
        });
    }
    static getAllByPostId(id, sortData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortBy, sortDirection, pageSize, pageNumber } = sortData;
            const comments = yield db_1.commentModel
                .find({ postId: id })
                .sort({ [sortBy]: sortDirection })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);
            const totalCount = yield db_1.commentModel.countDocuments({ postId: id });
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                items: comments.map(i => (0, comment_mappers_1.commentMapper)(i, userId))
            };
        });
    }
}
exports.CommentsQueryRepository = CommentsQueryRepository;
