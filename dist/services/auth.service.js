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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_query_repository_1 = require("../repositories/users.query.repository");
const email_adapter_1 = require("../adapters/email.adapter");
const user_repository_1 = require("../repositories/user.repository");
const uuid_1 = require("uuid");
const common_1 = require("../models/common/common");
const jwt_service_1 = require("../application/jwt.service");
class authService {
    static me(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(token);
            if (!userId)
                return { code: common_1.ResultCode.Forbidden };
            const user = yield users_query_repository_1.UserQueryRepository.getById(userId);
            if (!user)
                return { code: common_1.ResultCode.NotFound };
            return { code: common_1.ResultCode.Success, data: { email: user.email, login: user.login, userId: user.id } };
        });
    }
    static deleteToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(token);
            if (!userId)
                return { code: common_1.ResultCode.Forbidden };
            yield user_repository_1.UserRepository.putTokenInBL(userId, token);
            return { code: common_1.ResultCode.Success };
        });
    }
    static refreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(token);
            if (!userId)
                return { code: common_1.ResultCode.Forbidden };
            const user = yield users_query_repository_1.UserQueryRepository.getDBUserById(userId);
            if (!user)
                return { code: common_1.ResultCode.NotFound };
            const accessToken = yield jwt_service_1.jwtService.createJWT(user);
            const refreshToken = yield jwt_service_1.jwtService.createRefreshJWT(user);
            yield user_repository_1.UserRepository.putTokenInBL(userId, token);
            return { code: common_1.ResultCode.Success, data: { accessToken, refreshToken } };
        });
    }
    static resendConfirmationCode(email) {
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
            const sendCode = yield email_adapter_1.emailAdapter.sendEmail(email, subject, message);
            if (!sendCode)
                return false;
            return true;
        });
    }
    static confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.UserQueryRepository.getByCode(code);
            const updateConfirm = yield user_repository_1.UserRepository.updateConfirmation(user._id);
            if (updateConfirm)
                return { code: common_1.ResultCode.Success };
            return { code: common_1.ResultCode.NotFound };
        });
    }
    static checkCredentials(loginOrEmail, password) {
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
}
exports.authService = authService;
