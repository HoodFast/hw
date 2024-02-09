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
exports.jwtService = void 0;
let jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '123';
class jwtService {
    static createJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
            return token;
        });
    }
    static getUserByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jwt.verify(token, JWT_SECRET);
                return result.userId;
            }
            catch (err) {
                return null;
            }
        });
    }
}
exports.jwtService = jwtService;
