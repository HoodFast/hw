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
exports.SessionRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
class SessionRepository {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    getAllSessions(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const metaData = yield this.jwtService.getMetaDataByToken(token);
            if (!metaData)
                return null;
            const userId = metaData.userId;
            const result = yield db_1.tokenMetaModel.find({ userId: new mongodb_1.ObjectId(userId) }).lean();
            if (!result)
                return null;
            return result;
        });
    }
}
exports.SessionRepository = SessionRepository;
