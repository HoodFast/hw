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
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const uuid_1 = require("uuid");
const users_query_repository_1 = require("../repositories/users.query.repository");
const add_1 = require("date-fns/add");
const common_1 = require("../models/common/common");
const mongodb_1 = require("mongodb");
const auth_service_1 = require("./auth.service");
const bcrypt = require('bcrypt');
const saltRounds = 10;
class UserService {
    static createUser(login, email, password, isConfirmed) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.UserRepository.doesExistByLoginOrEmail(login, email);
            if (user)
                return { code: common_1.ResultCode.Forbidden };
            const createdAt = new Date();
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
                },
                tokensBlackList: []
            };
            const createdUser = yield user_repository_1.UserRepository.createUser(userData);
            if (!createdUser) {
                return { code: common_1.ResultCode.NotFound };
            }
            try {
                if (!isConfirmed) {
                    yield auth_service_1.AuthService.sendConfirmCode(createdUser.email);
                }
            }
            catch (e) {
                return { code: common_1.ResultCode.NotFound };
            }
            return { code: common_1.ResultCode.Success, data: createdUser };
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield users_query_repository_1.UserQueryRepository.getById(new mongodb_1.ObjectId(id));
            if (!findUser) {
                return null;
            }
            return yield users_query_repository_1.UserQueryRepository.deleteById(id);
        });
    }
    static recoveryPass(id, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(newPass, salt);
            const recover = yield user_repository_1.UserRepository.recoveryPass(id, hash);
            if (!recover)
                return { code: common_1.ResultCode.NotFound };
            return { code: common_1.ResultCode.Success };
        });
    }
}
exports.UserService = UserService;
