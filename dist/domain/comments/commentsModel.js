"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comment_db_model_1 = require("../../models/comments/db/comment.db.model");
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
            return true;
        }
        if (myStatus.likesStatus === likeStatus)
            return true;
        myStatus.likesStatus = likeStatus;
        myStatus.updatedAt = new Date();
        this.likesCount = likes.filter(i => i.likesStatus === comment_db_model_1.likesStatuses.like).length;
        this.dislikesCount = likes.filter(i => i.likesStatus === comment_db_model_1.likesStatuses.dislike).length;
        return true;
    };
exports.commentSchema.methods.getMyStatus =
    function (userId) {
        const likes = this.likes;
        const myStatus = likes.find(i => i.userId === userId);
        if (!myStatus)
            return comment_db_model_1.likesStatuses.none;
        return myStatus.likesStatus;
    };
