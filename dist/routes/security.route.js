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
exports.securityRoute = void 0;
const express_1 = require("express");
const session_query_repository_1 = require("../repositories/session.query.repository");
const security_service_1 = require("../services/security.service");
const common_1 = require("../models/common/common");
exports.securityRoute = (0, express_1.Router)({});
exports.securityRoute.get('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.sendStatus(401);
    const result = yield session_query_repository_1.sessionQueryRepository.getAllSessions(token);
    if (!result)
        return res.sendStatus(404);
    return res.status(200).send(result);
}));
exports.securityRoute.delete('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.sendStatus(401);
    const result = yield security_service_1.securityService.deleteAllSessions(token);
    if (!result)
        return res.sendStatus(404);
    return res.sendStatus(204);
}));
exports.securityRoute.delete('/devices/:deviceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.sendStatus(401);
    const deviceId = req.params.deviceId.trim();
    if (!deviceId)
        return res.sendStatus(404);
    const result = yield security_service_1.securityService.deleteSessionById(token, deviceId);
    console.log(result);
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
}));
