"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMapper = void 0;
const userMapper = (user) => {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    };
};
exports.userMapper = userMapper;
