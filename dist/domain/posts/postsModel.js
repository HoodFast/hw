"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comment_db_model_1 = require("../../models/comments/db/comment.db.model");
exports.postSchema = new mongoose_1.default.Schema({
    title: { type: String, require },
    shortDescription: { type: String, require },
    content: { type: String, require },
    blogId: { type: String, require },
    blogName: { type: String, require },
    createdAt: { type: String, require },
    likesCount: Number,
    dislikesCount: Number,
    likes: [{
            createdAt: Date,
            updatedAt: Date,
            login: String,
            userId: String,
            likesStatus: { type: String, enum: comment_db_model_1.likesStatuses }
        }]
});
exports.postSchema.methods.addLike =
    function (userId, likeStatus, login) {
        const likes = this.likes;
        const myStatus = likes.find(i => i.userId === userId);
        const newLike = {
            createdAt: new Date(),
            updatedAt: new Date(),
            login,
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
exports.postSchema.methods.getMyStatus =
    function (userId) {
        const likes = this.likes;
        const myStatus = likes.find(i => i.userId === userId);
        if (!myStatus)
            return comment_db_model_1.likesStatuses.none;
        return myStatus.likesStatus;
    };
exports.postSchema.methods.getNewestLikes =
    function () {
        const likes = this.likes.filter(i => i.likesStatus == comment_db_model_1.likesStatuses.like);
        const sortLikes = likes.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
        return sortLikes.slice(0, 3);
    };
