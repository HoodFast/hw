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
exports.recoverTokenGuard = void 0;
const jwt_service_1 = require("../../application/jwt.service");
const user_repository_1 = require("../../repositories/user.repository");
const recoverTokenGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.body.recoveryCode;
    const userId = yield jwt_service_1.jwtService.getUserByRecoverToken(token);
    if (!userId)
        return res.sendStatus(400);
    const user = yield user_repository_1.UserRepository.getUserById(userId);
    if (!user)
        return res.sendStatus(400);
    req.userId = user._id;
    return next();
});
exports.recoverTokenGuard = recoverTokenGuard;
