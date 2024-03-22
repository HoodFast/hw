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
exports.UserQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const user_mappers_1 = require("../models/users/mappers/user-mappers");
const db_1 = require("../db/db");
class UserQueryRepository {
    static getAll(sortData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber } = sortData;
            let loginFilter = {};
            let emailFilter = {};
            let filter = {};
            if (searchLoginTerm) {
                loginFilter = {
                    "accountData.login": { $regex: `${searchLoginTerm}`, $options: 'i' }
                };
            }
            if (searchEmailTerm) {
                emailFilter = {
                    "accountData.email": { $regex: `${searchEmailTerm}`, $options: 'i' }
                };
            }
            if (searchEmailTerm && searchLoginTerm) {
                filter = { $or: [loginFilter, emailFilter] };
            }
            else {
                filter = { $and: [loginFilter, emailFilter] };
            }
            const users = yield db_1.userModel
                .find(filter)
                .sort({ sortBy: sortDirection })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const totalCount = yield db_1.userModel.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                items: users.map(user_mappers_1.userMapper)
            };
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.userModel.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!user) {
                return null;
            }
            return (0, user_mappers_1.userMapper)(user);
        });
    }
    static getDBUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.userModel.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!user)
                return null;
            return user;
        });
    }
    static getByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.userModel.findOne({ $or: [{ 'accountData.email': loginOrEmail }, { 'accountData.login': loginOrEmail }] });
            if (!user)
                return null;
            return user;
        });
    }
    static getByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.userModel.findOne({ "emailConfirmation.confirmationCode": code });
            if (!user)
                return null;
            return user;
        });
    }
    static deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.userModel.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!res.deletedCount;
        });
    }
}
exports.UserQueryRepository = UserQueryRepository;
