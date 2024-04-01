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
exports.TokenMetaRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
class TokenMetaRepository {
    setTokenMetaData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.tokenMetaModel.insertMany(data);
            const TokenMeta = yield this.getByDeviceId(data.deviceId);
            if (!TokenMeta) {
                return false;
            }
            return !!TokenMeta;
        });
    }
    getByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = yield db_1.tokenMetaModel.findOne({ deviceId });
            if (!meta)
                return null;
            return meta;
        });
    }
    getSessionForLogin(userId, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = yield db_1.tokenMetaModel.findOne({ userId, title });
            return meta;
        });
    }
    getSessionForRefresh(iat, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = yield db_1.tokenMetaModel.findOne({ iat, deviceId });
            return meta;
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.tokenMetaModel.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!res.deletedCount;
        });
    }
    deleteByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.tokenMetaModel.deleteOne({ deviceId: deviceId });
            return !!res.deletedCount;
        });
    }
}
exports.TokenMetaRepository = TokenMetaRepository;
