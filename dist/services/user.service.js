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
const bcrypt = require('bcrypt');
const saltRounds = 10;
exports.userService = {
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            const data = { _passwordHash: hash, createdAt, email, login };
            const createdUser = yield user_repository_1.UserRepository.createUser(data);
            if (!createdUser) {
                return null;
            }
            return createdUser;
        });
    }
};
