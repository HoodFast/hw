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
exports.SecurityService = void 0;
const tokenMeta_repository_1 = require("../repositories/tokenMeta.repository");
const session_repository_1 = require("../repositories/session.repository");
const common_1 = require("../models/common/common");
const inversify_1 = require("inversify");
const jwt_service_1 = require("../application/jwt.service");
let SecurityService = class SecurityService {
    constructor(sessionRepository, tokenMetaRepository, jwtService) {
        this.sessionRepository = sessionRepository;
        this.tokenMetaRepository = tokenMetaRepository;
        this.jwtService = jwtService;
    }
    deleteAllSessions(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.sessionRepository.getAllSessions(token);
            if (!result)
                return false;
            const tokenMetaData = yield this.jwtService.getMetaDataByToken(token);
            if (!tokenMetaData)
                return false;
            for (let i = 0; i < result.length; i++) {
                if (result[i].iat.toISOString() !== tokenMetaData.iat.toISOString()) {
                    yield this.tokenMetaRepository.deleteById(result[i]._id);
                }
            }
            return true;
        });
    }
    deleteSessionById(token, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionMetaData = yield this.tokenMetaRepository.getByDeviceId(deviceId);
            if (!sessionMetaData)
                return { code: common_1.ResultCode.NotFound };
            const tokenMetaData = yield this.jwtService.getMetaDataByToken(token);
            if (!tokenMetaData)
                return { code: common_1.ResultCode.Unauthorized };
            if ((tokenMetaData === null || tokenMetaData === void 0 ? void 0 : tokenMetaData.userId) != sessionMetaData.userId) {
                return { code: common_1.ResultCode.Forbidden };
            }
            const res = yield this.tokenMetaRepository.deleteByDeviceId(deviceId);
            if (!res)
                return { code: common_1.ResultCode.NotFound };
            return { code: common_1.ResultCode.Success };
        });
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [session_repository_1.SessionRepository,
        tokenMeta_repository_1.TokenMetaRepository,
        jwt_service_1.JwtService])
], SecurityService);
