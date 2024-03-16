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
exports.authRoute = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const common_1 = require("../models/common/common");
const auth_validators_1 = require("../validators/auth-validators");
const jwt_service_1 = require("../application/jwt.service");
const accesstoken_middleware_1 = require("../middlewares/auth/accesstoken-middleware");
const users_validator_1 = require("../validators/users-validator");
const user_service_1 = require("../services/user.service");
const confirm_validators_1 = require("../validators/confirm-validators");
const email_validators_1 = require("../validators/email-validators");
const express_rate_limit_1 = require("express-rate-limit");
exports.authRoute = (0, express_1.Router)({});
const limiterLogin = (0, express_rate_limit_1.rateLimit)({ windowMs: 10000, max: 4 });
const limiterRegistrationEmailResending = (0, express_rate_limit_1.rateLimit)({ windowMs: 10000, max: 4 });
const limiterRegistration = (0, express_rate_limit_1.rateLimit)({ windowMs: 10000, max: 4 });
const limiterRegistrationConfirmation = (0, express_rate_limit_1.rateLimit)({ windowMs: 10000, max: 4 });
exports.authRoute.get('/me', accesstoken_middleware_1.accessTokenGuard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        return res.sendStatus(401);
    const me = yield auth_service_1.authService.me(userId);
    switch (me.code) {
        case common_1.ResultCode.Success:
            return res.status(200).send(me.data);
        case common_1.ResultCode.NotFound:
            return res.sendStatus(404);
        case common_1.ResultCode.Forbidden:
            return res.sendStatus(401);
        default:
            return res.sendStatus(404);
    }
}));
exports.authRoute.post('/login', limiterLogin, (0, auth_validators_1.authValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.headers['user-agent'] || 'none title';
    const ip = req.ip || 'none ip';
    const user = yield auth_service_1.authService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (!user)
        return res.sendStatus(401);
    const tokens = yield auth_service_1.authService.loginTokensPair(user, ip, title);
    switch (tokens.code) {
        case common_1.ResultCode.Success:
            const { accessToken, refreshToken } = tokens.data;
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
            return res.status(200).send({ accessToken });
        case common_1.ResultCode.Forbidden:
            return res.sendStatus(400);
        case common_1.ResultCode.NotFound:
            return res.sendStatus(404);
        default:
            return res.sendStatus(404);
    }
}));
exports.authRoute.post('/registration-email-resending', limiterRegistrationEmailResending, (0, email_validators_1.emailValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sendEmail = yield auth_service_1.authService.resendConfirmationCode(req.body.email);
    switch (sendEmail.code) {
        case common_1.ResultCode.Success:
            return res.sendStatus(204);
        case common_1.ResultCode.NotFound:
            return res.sendStatus(404);
        default:
            return res.sendStatus(404);
    }
}));
exports.authRoute.post('/registration', limiterRegistration, (0, users_validator_1.userValidators)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield user_service_1.userService.createUser(req.body.login, req.body.email, req.body.password);
    switch (createdUser.code) {
        case common_1.ResultCode.NotFound:
            return res.sendStatus(404);
        case common_1.ResultCode.Success:
            return res.sendStatus(204);
        default:
            return res.sendStatus(404);
    }
}));
exports.authRoute.post('/registration-confirmation', limiterRegistrationConfirmation, (0, confirm_validators_1.codeValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    if (!code)
        return res.sendStatus(404);
    const confirm = yield auth_service_1.authService.confirmEmail(code);
    switch (confirm.code) {
        case common_1.ResultCode.NotFound:
            return res.sendStatus(404);
        case common_1.ResultCode.Success:
            return res.sendStatus(204);
        default:
            return res.sendStatus(404);
    }
}));
exports.authRoute.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.headers['user-agent'] || 'none title';
    const ip = req.ip || 'none ip';
    const token = req.cookies.refreshToken;
    const user = yield jwt_service_1.jwtService.checkRefreshToken(token);
    if (!user)
        return res.sendStatus(401);
    const tokens = yield auth_service_1.authService.refreshTokensPair(user, ip, title, token);
    switch (tokens.code) {
        case common_1.ResultCode.Success:
            res.cookie('refreshToken', tokens.data.refreshToken, { httpOnly: true, secure: true });
            return res.status(200).send({ accessToken: tokens.data.accessToken });
        case common_1.ResultCode.Unauthorized:
            return res.sendStatus(401);
        case common_1.ResultCode.Forbidden:
            return res.sendStatus(403);
        case common_1.ResultCode.NotFound:
            return res.sendStatus(404);
        default:
            return res.sendStatus(404);
    }
}));
exports.authRoute.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteToken = yield auth_service_1.authService.deleteSession(req.cookies.refreshToken);
    switch (deleteToken.code) {
        case common_1.ResultCode.Success:
            return res.sendStatus(204);
        case common_1.ResultCode.Unauthorized:
            return res.sendStatus(401);
        case common_1.ResultCode.Forbidden:
            return res.sendStatus(403);
        case common_1.ResultCode.NotFound:
            return res.sendStatus(404);
        default:
            return res.sendStatus(404);
    }
}));
