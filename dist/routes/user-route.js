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
exports.userRoute = void 0;
const express_1 = require("express");
const users_query_repository_1 = require("../repositories/users.query.repository");
const user_service_1 = require("../services/user.service");
exports.userRoute = (0, express_1.Router)({});
exports.userRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const sortData = {
        searchLoginTerm: (_a = req.query.searchLoginTerm) !== null && _a !== void 0 ? _a : null,
        searchEmailTerm: (_b = req.query.searchEmailTerm) !== null && _b !== void 0 ? _b : null,
        sortBy: (_c = req.query.sortBy) !== null && _c !== void 0 ? _c : 'createdAt',
        sortDirection: (_d = req.query.sortDirection) !== null && _d !== void 0 ? _d : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    };
    const users = yield users_query_repository_1.UserQueryRepository.getAll(sortData);
    return res.send(users);
}));
exports.userRoute.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield user_service_1.userService.createUser(req.body.login, req.body.email, req.body.password);
    if (!createdUser) {
        res.sendStatus(404);
        return;
    }
    res.status(201).send(createdUser);
}));