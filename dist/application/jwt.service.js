"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.JwtService = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../app/config");
const user_repository_1 = require("../repositories/user.repository");
const crypto_1 = require("crypto");
const tokenMeta_repository_1 = require("../repositories/tokenMeta.repository");
const users_query_repository_1 = require("../repositories/users.query.repository");
const inversify_1 = require("inversify");
let jwt = require('jsonwebtoken');
let JwtService = class JwtService {
    constructor(tokenMetaRepository) {
        this.tokenMetaRepository = tokenMetaRepository;
    }
    createJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jwt.sign({ userId: user._id }, config_1.appConfig.AC_SECRET, { expiresIn: config_1.appConfig.AC_TIME });
            return token;
        });
    }
    createRecoveryCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_query_repository_1.UserQueryRepository.getByLoginOrEmail(email);
                let userId;
                if (!(user === null || user === void 0 ? void 0 : user._id)) {
                    userId = new mongodb_1.ObjectId((0, crypto_1.randomUUID)());
                }
                else {
                    userId = user._id;
                }
                const token = jwt.sign({ userId: userId }, config_1.appConfig.RECOVERY_SECRET, { expiresIn: config_1.appConfig.RECOVERY_TIME });
                return token;
            }
            catch (e) {
                console.log('CreateRecoveryError');
            }
        });
    }
    getMetaDataByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jwt.verify(token, config_1.appConfig.RT_SECRET);
                const decoded = jwt.decode(token, { complete: true });
                const userId = decoded.payload.userId;
                const iat = new Date(decoded.payload.iat * 1000);
                const deviceId = result.deviceId;
                return { iat, deviceId, userId };
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    createRefreshJWT(user, deviceId = (0, crypto_1.randomUUID)(), ip, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = user._id;
            const token = jwt.sign({ userId, deviceId }, config_1.appConfig.RT_SECRET, { expiresIn: config_1.appConfig.RT_TIME });
            const decoded = jwt.decode(token, { complete: true });
            const iat = new Date(decoded.payload.iat * 1000);
            const tokenMetaData = {
                iat,
                deviceId,
                expireDate: decoded.payload.exp,
                userId,
                ip,
                title,
            };
            const setTokenMetaData = yield this.tokenMetaRepository.setTokenMetaData(tokenMetaData);
            if (!setTokenMetaData)
                return null;
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
    static getUserByRecoverToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jwt.verify(token, config_1.appConfig.RECOVERY_SECRET);
                return result.userId;
            }
            catch (err) {
                return null;
            }
        });
    }
    static checkRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jwt.verify(token, config_1.appConfig.RT_SECRET);
                const blackList = yield user_repository_1.UserRepository.getBlackList(result.userId);
                if (blackList === null || blackList === void 0 ? void 0 : blackList.includes(token))
                    return null;
                const user = yield user_repository_1.UserRepository.getUserById(result.userId);
                return user;
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
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [tokenMeta_repository_1.TokenMetaRepository])
], JwtService);
