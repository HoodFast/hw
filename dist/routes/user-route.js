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
const common_1 = require("../models/common/common");
const user_service_1 = require("../services/user.service");
const mongodb_1 = require("mongodb");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const users_validator_1 = require("../validators/users-validator");
exports.userRoute = (0, express_1.Router)({});
exports.userRoute.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    res.send(users);
    return;
}));
exports.userRoute.post('/', auth_middleware_1.authMiddleware, (0, users_validator_1.userValidators)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield user_service_1.userService.createUser(req.body.login, req.body.email, req.body.password, true);
    switch (createdUser.code) {
        case common_1.ResultCode.NotFound:
            return res.sendStatus(404);
        case common_1.ResultCode.Forbidden:
            return res.status(400).send({ errorsMessages: { message: createdUser.errorMessage, field: createdUser.errorMessage } });
        case common_1.ResultCode.Success:
            return res.status(201).send(createdUser.data);
        default:
            return res.sendStatus(404);
    }
}));
exports.userRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const userIsDeleted = yield user_service_1.userService.deleteUser(id);
    if (!userIsDeleted) {
        res.sendStatus(404);
        return;
    }
    return res.sendStatus(204);
}));
