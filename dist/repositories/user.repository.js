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
const db_1 = require("../db/db");
const users_query_repository_1 = require("./users.query.repository");
const mongodb_1 = require("mongodb");
class UserRepository {
    static createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.usersCollection.insertOne(data);
            const user = users_query_repository_1.UserQueryRepository.getById(res.insertedId.toString());
            if (!user) {
                return null;
            }
            return user;
        });
    }
    static doesExistById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return !!res;
        });
    }
}
exports.UserRepository = UserRepository;
;
