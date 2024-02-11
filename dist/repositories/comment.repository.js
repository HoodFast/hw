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
exports.CommentRepository = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const comment_query_repository_1 = require("./comment.query.repository");
class CommentRepository {
    static createComment(createData) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.commentsCollection.insertOne(createData);
            const comment = yield comment_query_repository_1.CommentsQueryRepository.getById(res.insertedId.toString());
            if (!comment) {
                return null;
            }
            return comment;
        });
    }
    static updateBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.commentsCollection.updateOne({ _id: new mongodb_1.ObjectId(data.id) }, {
                $set: {
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl
                }
            });
            return !!res.matchedCount;
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blog) {
                return null;
            }
            return blog;
        });
    }
    static deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!res.deletedCount;
        });
    }
}
exports.CommentRepository = CommentRepository;
