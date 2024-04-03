"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMapper = void 0;
const comment_db_model_1 = require("../../comments/db/comment.db.model");
const postMapper = (post) => {
    const newestLikes = post.getNewestLikes();
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: comment_db_model_1.likesStatuses.none,
            newestLikes
        }
    };
};
exports.postMapper = postMapper;
