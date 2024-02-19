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
exports.userService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const uuid_1 = require("uuid");
const users_query_repository_1 = require("../repositories/users.query.repository");
const add_1 = require("date-fns/add");
const auth_service_1 = require("./auth.service");
const common_1 = require("../models/common/common");
const bcrypt = require('bcrypt');
const saltRounds = 10;
class userService {
    static createUser(login, email, password, isConfirmed) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExistEmail = yield users_query_repository_1.UserQueryRepository.getByLoginOrEmail(email);
            const isExistLogin = yield users_query_repository_1.UserQueryRepository.getByLoginOrEmail(login);
            if (isExistEmail)
                return { code: common_1.ResultCode.Error, errorMessage: { message: 'Email is exist', field: 'email' } };
            if (isExistLogin)
                return { code: common_1.ResultCode.Error, errorMessage: { message: 'Login is exist', field: 'login' } };
            const createdAt = new Date().toISOString();
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            const userData = {
                accountData: { _passwordHash: hash, createdAt, email, login },
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.add)(new Date(), {
                        hours: 1,
                        minutes: 30
                    }),
                    isConfirmed: isConfirmed ? isConfirmed : false
                }
            };
            const createdUser = yield user_repository_1.UserRepository.createUser(userData);
            if (!createdUser) {
                return { code: common_1.ResultCode.NotFound };
            }
            try {
                yield auth_service_1.authService.sendConfirmCode(createdUser.email);
            }
            catch (e) {
                console.log(e);
                return { code: common_1.ResultCode.NotFound };
            }
            return { code: common_1.ResultCode.Success, data: createdUser };
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield users_query_repository_1.UserQueryRepository.getById(id);
            if (!findUser) {
                return null;
            }
            return yield users_query_repository_1.UserQueryRepository.deleteById(id);
        });
    }
}
exports.userService = userService;
