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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comment_db_model_1 = require("./comment.db.model");
const common_1 = require("../../common/common");
exports.commentSchema = new mongoose_1.default.Schema({
    content: String,
    postId: { type: String, require },
    commentatorInfo: {
        userId: { type: String, require },
        userLogin: { type: String, require },
    },
    createdAt: String,
    likesCount: Number,
    dislikesCount: Number,
    likes: [{
            createdAt: Date,
            updatedAt: Date,
            userId: String,
            likesStatus: { type: String, enum: comment_db_model_1.likesStatuses }
        }]
});
exports.commentSchema.methods.addLike =
    function (userId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const likes = this.likes;
            const myStatus = likes.find(i => i.userId === userId);
            const newLike = {
                createdAt: new Date(),
                updatedAt: new Date(),
                userId,
                likesStatus: likeStatus
            };
            if (!myStatus) {
                likes.push(newLike);
                this.likesCount = likes.filter(i => i.likesStatus === comment_db_model_1.likesStatuses.like).length;
                this.dislikesCount = likes.filter(i => i.likesStatus === comment_db_model_1.likesStatuses.dislike).length;
                return { code: common_1.ResultCode.Success };
            }
            if (myStatus.likesStatus === likeStatus)
                return { code: common_1.ResultCode.Success };
            myStatus.likesStatus = likeStatus;
            myStatus.updatedAt = new Date();
            this.likesCount = likes.filter(i => i.likesStatus === comment_db_model_1.likesStatuses.like).length;
            this.dislikesCount = likes.filter(i => i.likesStatus === comment_db_model_1.likesStatuses.dislike).length;
            return { code: common_1.ResultCode.Success };
        });
    };
exports.commentSchema.methods.getMyStatus =
    function (userId) {
        const likes = this.likes;
        const myStatus = likes.find(i => i.userId === userId);
        if (!myStatus)
            return comment_db_model_1.likesStatuses.none;
        return myStatus.likesStatus;
    };
