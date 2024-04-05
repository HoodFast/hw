"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMapper = void 0;
const comment_db_model_1 = require("../../comments/db/comment.db.model");
const newestLikes_mapper_1 = require("../../post/mappers/newestLikes.mapper");
const postMapper = (post, userId) => {
    const getNewestLikes = post.getNewestLikes();
    const newestLikes = getNewestLikes.map(newestLikes_mapper_1.newestLikesMapper);
    let myStatus = comment_db_model_1.likesStatuses.none;
    if (userId) {
        myStatus = post.getMyStatus(userId);
    }
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount,
            myStatus,
            newestLikes
        }
    };
};
exports.postMapper = postMapper;
