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
exports.SecurityController = exports.securityRoute = void 0;
require("reflect-metadata");
const express_1 = require("express");
const session_query_repository_1 = require("../repositories/session.query.repository");
const security_service_1 = require("../services/security.service");
const common_1 = require("../models/common/common");
const composition_root_1 = require("../composition-root");
const inversify_1 = require("inversify");
exports.securityRoute = (0, express_1.Router)({});
let SecurityController = class SecurityController {
    constructor(sessionQueryRepository, securityService) {
        this.sessionQueryRepository = sessionQueryRepository;
        this.securityService = securityService;
    }
    getAllSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.refreshToken;
            if (!token)
                return res.sendStatus(401);
            const result = yield this.sessionQueryRepository.getAllSessions(token);
            if (!result)
                return res.sendStatus(404);
            return res.status(200).send(result);
        });
    }
    deleteAllSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.refreshToken;
            if (!token)
                return res.sendStatus(401);
            const result = yield this.securityService.deleteAllSessions(token);
            if (!result)
                return res.sendStatus(404);
            return res.sendStatus(204);
        });
    }
    deleteSessionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.refreshToken;
            if (!token)
                return res.sendStatus(401);
            const deviceId = req.params.deviceId.trim();
            if (!deviceId)
                return res.sendStatus(404);
            const result = yield this.securityService.deleteSessionById(token, deviceId);
            switch (result.code) {
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
};
exports.SecurityController = SecurityController;
exports.SecurityController = SecurityController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [session_query_repository_1.SessionQueryRepository,
        security_service_1.SecurityService])
], SecurityController);
const securityController = composition_root_1.container.resolve(SecurityController);
exports.securityRoute.get('/devices', securityController.getAllSessions.bind(securityController));
exports.securityRoute.delete('/devices', securityController.deleteAllSession.bind(securityController));
exports.securityRoute.delete('/devices/:deviceId', securityController.deleteSessionById.bind(securityController));
