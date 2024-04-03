"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newestLikesMapper = void 0;
const newestLikesMapper = (like) => {
    return {
        addedAt: like.updatedAt.toISOString(),
        userId: like.userId,
        login: like.login
    };
};
exports.newestLikesMapper = newestLikesMapper;
