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
const auth_validators_1 = require("../validators/auth-validators");
exports.authRoute = (0, express_1.Router)({});
exports.authRoute.post('/login', (0, auth_validators_1.authValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;
    const authorisation = yield auth_service_1.authService.checkCredentials({ loginOrEmail, password });
    if (!authorisation) {
        res.sendStatus(401);
        return;
    }
    res.sendStatus(204);
}));
