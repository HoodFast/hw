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
const users_query_repository_1 = require("../repositories/users.query.repository");
const users_validator_1 = require("../validators/users-validator");
const user_service_1 = require("../services/user.service");
const confirm_validators_1 = require("../validators/confirm-validators");
const email_validators_1 = require("../validators/email-validators");
exports.authRoute = (0, express_1.Router)({});
exports.authRoute.get('/me', accesstoken_middleware_1.accessTokenGuard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        return res.sendStatus(401);
    const me = yield users_query_repository_1.UserQueryRepository.getById(userId);
    return res.status(200).send(me);
}));
exports.authRoute.post('/login', (0, auth_validators_1.authValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.authService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = yield jwt_service_1.jwtService.createJWT(user);
        return res.status(200).send({ accessToken: token });
    }
    else {
        return res.sendStatus(401);
    }
}));
exports.authRoute.post('/registration-email-resending', (0, email_validators_1.emailValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sendEmail = yield auth_service_1.authService.resendConfirmationCode(req.body.email);
    if (!sendEmail)
        return res.sendStatus(404);
    return res.sendStatus(204);
}));
exports.authRoute.post('/registration', (0, users_validator_1.userValidators)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield user_service_1.userService.createUser(req.body.login, req.body.email, req.body.password);
    switch (createdUser.code) {
        case common_1.ResultCode.NotFound:
            return res.sendStatus(404);
        case common_1.ResultCode.Forbidden:
            return res.status(400).send({ errorsMessages: [{ message: createdUser.errorMessage, field: createdUser.errorMessage }] });
        case common_1.ResultCode.Success:
            return res.sendStatus(204);
    }
}));
exports.authRoute.post('/registration-confirmation', (0, confirm_validators_1.codeValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    if (!code)
        return res.sendStatus(404);
    const confirm = yield auth_service_1.authService.confirmEmail(code);
    if (!confirm)
        return res.sendStatus(404);
    return res.sendStatus(204);
}));
