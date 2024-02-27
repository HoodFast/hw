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
exports.jwtService = void 0;
const config_1 = require("../app/config");
const user_repository_1 = require("../repositories/user.repository");
let jwt = require('jsonwebtoken');
class jwtService {
    static createJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jwt.sign({ userId: user._id }, config_1.appConfig.AC_SECRET, { expiresIn: config_1.appConfig.AC_TIME });
            return token;
        });
    }
    static createRefreshJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jwt.sign({ userId: user._id }, config_1.appConfig.RT_SECRET, { expiresIn: config_1.appConfig.RT_TIME });
            return token;
        });
    }
    static getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jwt.verify(token, config_1.appConfig.AC_SECRET);
                const blackList = yield user_repository_1.UserRepository.getBlackList(result.userId);
                if (blackList === null || blackList === void 0 ? void 0 : blackList.includes(token))
                    return null;
                return result.userId;
            }
            catch (err) {
                return null;
            }
        });
    }
    static getUserIdByRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jwt.verify(token, config_1.appConfig.RT_SECRET);
                const blackList = yield user_repository_1.UserRepository.getBlackList(result.userId);
                if (blackList === null || blackList === void 0 ? void 0 : blackList.includes(token))
                    return null;
                return result.userId;
            }
            catch (err) {
                return null;
            }
        });
    }
}
exports.jwtService = jwtService;
