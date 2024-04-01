"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.SessionQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const jwt_service_1 = require("../application/jwt.service");
const session_mappers_1 = require("../models/sessions/mappers/session-mappers");
const db_1 = require("../db/db");
const inversify_1 = require("inversify");
let SessionQueryRepository = class SessionQueryRepository {
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
            return (0, session_mappers_1.sessionMapper)(result);
        });
    }
};
exports.SessionQueryRepository = SessionQueryRepository;
exports.SessionQueryRepository = SessionQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtService])
], SessionQueryRepository);
