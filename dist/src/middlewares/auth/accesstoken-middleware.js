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
exports.accessTokenGuard = void 0;
const jwt_service_1 = require("../../application/jwt.service");
const users_query_repository_1 = require("../../repositories/users.query.repository");
const user_repository_1 = require("../../repositories/user.repository");
const mongodb_1 = require("mongodb");
const accessTokenGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    debugger;
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }
    let tokenBearer = req.headers.authorization;
    const token = tokenBearer.split(' ');
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token[1]);
    if (userId) {
        const user = yield user_repository_1.UserRepository.doesExistById(userId);
        if (!user) {
            return res.sendStatus(401);
        }
        const userData = yield users_query_repository_1.UserQueryRepository.getById(userId);
        req.userId = new mongodb_1.ObjectId(userData.id);
        return next();
    }
    res.sendStatus(401);
    return;
});
exports.accessTokenGuard = accessTokenGuard;
