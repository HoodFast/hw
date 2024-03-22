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
exports.UserRepository = void 0;
const users_query_repository_1 = require("./users.query.repository");
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
class UserRepository {
    static createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.userModel.insertMany(data);
            const user = users_query_repository_1.UserQueryRepository.getById(res[0]._id);
            if (!user) {
                return null;
            }
            return user;
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.userModel.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!res)
                return null;
            return res;
        });
    }
    static recoveryPass(userId, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.userModel.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $set: { 'accountData._passwordHash': hash }
            });
            return res.modifiedCount === 1;
        });
    }
    static getBlackList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.userModel.findOne({ _id: new mongodb_1.ObjectId(userId) });
            if (!res)
                return null;
            return res.tokensBlackList;
        });
    }
    static updateConfirmation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.userModel.updateOne({ _id: userId }, {
                $set: {
                    "emailConfirmation.isConfirmed": true
                }
            });
            return res.modifiedCount === 1;
        });
    }
    static updateNewConfirmCode(userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.userModel.updateOne({ _id: userId }, {
                $set: {
                    "emailConfirmation.confirmationCode": code
                }
            });
            return res.modifiedCount === 1;
        });
    }
    static doesExistById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.userModel.findOne({ _id: new mongodb_1.ObjectId(id) });
            return !!res;
        });
    }
    static doesExistByLoginOrEmail(login, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.userModel.findOne({ $or: [{ 'accountData.email': email }, { 'accountData.login': login }] });
            return !!user;
        });
    }
}
exports.UserRepository = UserRepository;
;
