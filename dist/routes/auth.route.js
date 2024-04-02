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
exports.AuthController = exports.authRoute = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const common_1 = require("../models/common/common");
const auth_validators_1 = require("../validators/auth-validators");
const accesstoken_middleware_1 = require("../middlewares/auth/accesstoken-middleware");
const users_validator_1 = require("../validators/users-validator");
const user_service_1 = require("../services/user.service");
const confirm_validators_1 = require("../validators/confirm-validators");
const email_validators_1 = require("../validators/email-validators");
const rateLimit_middleware_1 = require("../middlewares/rateLimutMiddleware/rateLimit.middleware");
const recover_token_middleware_1 = require("../middlewares/auth/recover-token-middleware");
const recovery_validators_1 = require("../validators/recovery-validators");
const email_pass_recover_validators_1 = require("../validators/email-pass-recover-validators");
const composition_root_1 = require("../composition-root");
const inversify_1 = require("inversify");
const jwt_service_1 = require("../application/jwt.service");
exports.authRoute = (0, express_1.Router)({});
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            if (!userId)
                return res.sendStatus(401);
            const me = yield this.authService.me(userId);
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
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = req.headers['user-agent'] || 'none title';
            const ip = req.ip || 'none ip';
            const user = yield this.authService.checkCredentials(req.body.loginOrEmail, req.body.password);
            if (!user)
                return res.sendStatus(401);
            const tokens = yield this.authService.loginTokensPair(user, ip, title);
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
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteToken = yield this.authService.deleteSession(req.cookies.refreshToken);
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
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield user_service_1.UserService.createUser(req.body.login, req.body.email, req.body.password);
            switch (createdUser.code) {
                case common_1.ResultCode.NotFound:
                    return res.sendStatus(404);
                case common_1.ResultCode.Success:
                    return res.sendStatus(204);
                default:
                    return res.sendStatus(404);
            }
        });
    }
    registrationEmailConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.body.code;
            if (!code)
                return res.sendStatus(404);
            const confirm = yield this.authService.confirmEmail(code);
            switch (confirm.code) {
                case common_1.ResultCode.NotFound:
                    return res.sendStatus(404);
                case common_1.ResultCode.Success:
                    return res.sendStatus(204);
                default:
                    return res.sendStatus(404);
            }
        });
    }
    registrationEmailResending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendEmail = yield this.authService.resendConfirmationCode(req.body.email);
            switch (sendEmail.code) {
                case common_1.ResultCode.Success:
                    return res.sendStatus(204);
                case common_1.ResultCode.NotFound:
                    return res.sendStatus(404);
                default:
                    return res.sendStatus(404);
            }
        });
    }
    passwordRecovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const recoverySend = yield this.authService.sendRecoveryPass(email);
            switch (recoverySend.code) {
                case common_1.ResultCode.Success:
                    return res.sendStatus(204);
                default:
                    return res.sendStatus(404);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPass = req.body.newPassword;
            const recoverPass = yield user_service_1.UserService.recoveryPass(req.userId, newPass);
            switch (recoverPass.code) {
                case common_1.ResultCode.Success:
                    return res.sendStatus(204);
                default:
                    return res.sendStatus(404);
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = req.headers['user-agent'] || 'none title';
            const ip = req.ip || 'none ip';
            const token = req.cookies.refreshToken;
            const user = yield jwt_service_1.JwtService.checkRefreshToken(token);
            if (!user)
                return res.sendStatus(401);
            const tokens = yield this.authService.refreshTokensPair(user, ip, title, token);
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
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
const authController = composition_root_1.container.resolve(AuthController);
exports.authRoute.get('/me', accesstoken_middleware_1.accessTokenGuard, authController.getMe.bind(authController));
exports.authRoute.post('/login', rateLimit_middleware_1.rateLimitMiddleware, (0, auth_validators_1.authValidation)(), authController.login.bind(authController));
exports.authRoute.post('/logout', authController.logout.bind(authController));
exports.authRoute.post('/registration', rateLimit_middleware_1.rateLimitMiddleware, (0, users_validator_1.userValidators)(), authController.registration.bind(authController));
exports.authRoute.post('/registration-confirmation', rateLimit_middleware_1.rateLimitMiddleware, (0, confirm_validators_1.codeValidation)(), authController.registrationEmailConfirmation.bind(authController));
exports.authRoute.post('/registration-email-resending', rateLimit_middleware_1.rateLimitMiddleware, (0, email_validators_1.emailValidation)(), authController.registrationEmailResending.bind(authController));
exports.authRoute.post('/password-recovery', rateLimit_middleware_1.rateLimitMiddleware, (0, email_pass_recover_validators_1.emailPassRecoverValidation)(), authController.passwordRecovery.bind(authController));
exports.authRoute.post('/new-password', rateLimit_middleware_1.rateLimitMiddleware, (0, recovery_validators_1.recoveryValidation)(), recover_token_middleware_1.recoverTokenGuard, authController.changePassword.bind(authController));
exports.authRoute.post('/refresh-token', recover_token_middleware_1.recoverTokenGuard, authController.refreshToken.bind(authController));
