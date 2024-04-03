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
    likes: [{
            createdAt: Date,
            updatedAt: Date,
            userId: String,
            likesStatus: { type: String, enum: comment_db_model_1.likesStatuses }
        }]
});
