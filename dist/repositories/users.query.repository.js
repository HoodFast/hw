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
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const user_mappers_1 = require("../models/users/mappers/user-mappers");
class UserQueryRepository {
    static getAll(sortData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber } = sortData;
            const users = yield db_1.usersCollection
                .find({})
                .sort(sortBy, sortDirection)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            const totalCount = yield db_1.usersCollection.countDocuments({});
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
            const user = yield db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!user) {
                return null;
            }
            return (0, user_mappers_1.userMapper)(user);
        });
    }
    static getByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
            if (!user) {
                return null;
            }
            return user;
        });
    }
}
exports.UserQueryRepository = UserQueryRepository;
