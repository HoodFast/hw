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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_query_repository_1 = require("../repositories/users.query.repository");
const email_adapter_1 = require("../adapters/email.adapter");
const user_repository_1 = require("../repositories/user.repository");
const uuid_1 = require("uuid");
const common_1 = require("../models/common/common");
const tokenMeta_repository_1 = require("../repositories/tokenMeta.repository");
const jwt_service_1 = require("../application/jwt.service");
let AuthService = class AuthService {
    constructor(tokenMetaRepository, jwtService) {
        this.tokenMetaRepository = tokenMetaRepository;
        this.jwtService = jwtService;
    }
    me(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.UserQueryRepository.getById(userId);
            if (!user)
                return { code: common_1.ResultCode.NotFound };
            return { code: common_1.ResultCode.Success, data: { email: user.email, login: user.login, userId: user.id } };
        });
    }
    deleteSession(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const metaData = yield this.jwtService.getMetaDataByToken(token);
            if (!metaData)
                return { code: common_1.ResultCode.Unauthorized };
            const oldSession = yield this.tokenMetaRepository.getSessionForRefresh(metaData.iat, metaData.deviceId);
            if (oldSession) {
                yield this.tokenMetaRepository.deleteById(oldSession._id);
            }
            else {
                return { code: common_1.ResultCode.Unauthorized };
            }
            return { code: common_1.ResultCode.Success };
        });
    }
    // static async refreshToken(token: string, ip: string, title: string) {
    //     const userId = await jwtService.getUserIdByRefreshToken(token)
    //     if (!userId) return {code: ResultCode.Forbidden}
    //     const user = await UserQueryRepository.getDBUserById(userId)
    //     if (!user) return {code: ResultCode.NotFound}
    //     const accessToken = await jwtService.createJWT(user)
    //     const refreshToken = await jwtService.createRefreshJWT(user, ip, title)
    //     await UserRepository.putTokenInBL(userId, token)
    //     return {code: ResultCode.Success, data: {accessToken, refreshToken}}
    // }
    loginTokensPair(user, ip, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = user._id;
            const oldSession = yield this.tokenMetaRepository.getSessionForLogin(userId, title);
            const deviceId = oldSession === null || oldSession === void 0 ? void 0 : oldSession.deviceId;
            if (oldSession) {
                yield this.tokenMetaRepository.deleteById(oldSession._id);
            }
            const accessToken = yield this.jwtService.createJWT(user);
            if (!accessToken)
                return { code: common_1.ResultCode.Forbidden };
            const refreshToken = yield this.jwtService.createRefreshJWT(user, deviceId, ip, title);
            if (!refreshToken)
                return { code: common_1.ResultCode.Forbidden };
            return { code: common_1.ResultCode.Success, data: { accessToken, refreshToken } };
        });
    }
    refreshTokensPair(user, ip, title, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const metaData = yield this.jwtService.getMetaDataByToken(token);
            if (!metaData)
                return { code: common_1.ResultCode.Unauthorized };
            const oldSession = yield this.tokenMetaRepository.getSessionForRefresh(metaData.iat, metaData.deviceId);
            const deviceId = oldSession === null || oldSession === void 0 ? void 0 : oldSession.deviceId;
            if (oldSession) {
                yield this.tokenMetaRepository.deleteById(oldSession._id);
            }
            else {
                return { code: common_1.ResultCode.Unauthorized };
            }
            const accessToken = yield this.jwtService.createJWT(user);
            if (!accessToken)
                return { code: common_1.ResultCode.Forbidden };
            const refreshToken = yield this.jwtService.createRefreshJWT(user, deviceId, ip, title);
            if (!refreshToken)
                return { code: common_1.ResultCode.Forbidden };
            return { code: common_1.ResultCode.Success, data: { accessToken, refreshToken } };
        });
    }
    resendConfirmationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.UserQueryRepository.getByLoginOrEmail(email);
            if (!user)
                return { code: common_1.ResultCode.NotFound };
            const newConfirmationCode = (0, uuid_1.v4)();
            const updateConfirmCode = yield user_repository_1.UserRepository.updateNewConfirmCode(user._id, newConfirmationCode);
            if (!updateConfirmCode)
                return { code: common_1.ResultCode.NotFound };
            const subject = "Email Confirmation";
            const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newConfirmationCode}'>complete registration</a>
        </p>`;
            const sendCode = yield email_adapter_1.emailAdapter.sendEmail(email, subject, message);
            if (!sendCode)
                return { code: common_1.ResultCode.NotFound };
            return { code: common_1.ResultCode.Success };
        });
    }
    static sendConfirmCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.UserQueryRepository.getByLoginOrEmail(email);
            if (!user)
                return false;
            const subject = "Email Confirmation";
            const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>`;
            const sending = yield email_adapter_1.emailAdapter.sendEmail(email, subject, message);
            if (!sending)
                return false;
            return true;
        });
    }
    sendRecoveryPass(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = "Password recovery";
            const recoveryCode = yield this.jwtService.createRecoveryCode(email);
            const message = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`;
            try {
                yield email_adapter_1.emailAdapter.sendEmail(email, subject, message);
            }
            catch (e) {
                return { code: common_1.ResultCode.Error };
            }
            return { code: common_1.ResultCode.Success };
        });
    }
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.UserQueryRepository.getByCode(code);
            if (!user)
                return { code: common_1.ResultCode.Forbidden };
            if (user.emailConfirmation.isConfirmed)
                return { code: common_1.ResultCode.Forbidden };
            if (user.emailConfirmation.expirationDate < new Date())
                return {
                    code: common_1.ResultCode.Forbidden,
                    errorMessage: { message: 'expired', field: 'expirationDate' }
                };
            const updateConfirm = yield user_repository_1.UserRepository.updateConfirmation(user._id);
            if (updateConfirm)
                return { code: common_1.ResultCode.Success };
            return { code: common_1.ResultCode.NotFound };
        });
    }
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.UserQueryRepository.getByLoginOrEmail(loginOrEmail);
            if (!user)
                return null;
            if (!user.emailConfirmation.isConfirmed)
                return null;
            const res = yield bcrypt_1.default.compare(password, user.accountData._passwordHash);
            if (!res) {
                return null;
            }
            else {
                return user;
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [tokenMeta_repository_1.TokenMetaRepository,
        jwt_service_1.JwtService])
], AuthService);
