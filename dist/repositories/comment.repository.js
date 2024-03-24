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
const mongodb_1 = require("mongodb");
const comment_query_repository_1 = require("./comment.query.repository");
const db_1 = require("../db/db");
class CommentRepository {
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.commentModel.findOne({ _id: new mongodb_1.ObjectId(commentId) });
                if (!res) {
                    return null;
                }
                return res;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    static createComment(createData) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.commentModel.insertMany(createData);
            const comment = yield comment_query_repository_1.CommentsQueryRepository.getById(res[0]._id, res[0].commentatorInfo.userId);
            if (!comment) {
                return null;
            }
            return comment;
        });
    }
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.commentModel.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    content,
                }
            });
            return !!res.matchedCount;
        });
    }
    static deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.commentModel.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!res.deletedCount;
        });
    }
}
exports.CommentRepository = CommentRepository;
