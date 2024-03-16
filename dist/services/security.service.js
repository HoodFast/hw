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
exports.securityService = void 0;
const tokenMeta_repository_1 = require("../repositories/tokenMeta.repository");
const session_repository_1 = require("../repositories/session.repository");
const jwt_service_1 = require("../application/jwt.service");
const common_1 = require("../models/common/common");
class securityService {
    static deleteAllSessions(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield session_repository_1.sessionRepository.getAllSessions(token);
            if (!result)
                return false;
            const tokenMetaData = yield jwt_service_1.jwtService.getMetaDataByToken(token);
            if (!tokenMetaData)
                return false;
            for (let i = 0; i < result.length; i++) {
                if (result[i].iat.toISOString() !== tokenMetaData.iat.toISOString()) {
                    yield tokenMeta_repository_1.TokenMetaRepository.deleteById(result[i]._id);
                }
            }
            return true;
        });
    }
    static deleteSessionById(token, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionMetaData = yield tokenMeta_repository_1.TokenMetaRepository.getByDeviceId(deviceId);
            if (!sessionMetaData)
                return { code: common_1.ResultCode.NotFound };
            const tokenMetaData = yield jwt_service_1.jwtService.getMetaDataByToken(token);
            if (!tokenMetaData)
                return { code: common_1.ResultCode.Unauthorized };
            if ((tokenMetaData === null || tokenMetaData === void 0 ? void 0 : tokenMetaData.userId) !== sessionMetaData.userId)
                return { code: common_1.ResultCode.Forbidden };
            const res = yield tokenMeta_repository_1.TokenMetaRepository.deleteByDeviceId(deviceId);
            if (!res)
                return { code: common_1.ResultCode.NotFound };
            return { code: common_1.ResultCode.Success };
        });
    }
}
exports.securityService = securityService;
