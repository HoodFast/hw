"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentMapper = void 0;
const comment_db_model_1 = require("../db/comment.db.model");
const commentMapper = (comment, userId) => {
    // @ts-ignore
    let myStatus = comment.getMyStatus(userId);
    debugger;
    if (!myStatus) {
        myStatus = comment_db_model_1.likesStatuses.none;
    }
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
            myStatus: myStatus
        }
    };
};
exports.commentMapper = commentMapper;
