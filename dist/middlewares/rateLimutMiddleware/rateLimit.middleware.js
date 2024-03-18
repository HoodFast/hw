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
exports.rateLimitMiddleware = void 0;
let limitListDB = [];
const rateLimitMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.ip;
    if (!ip)
        return res.sendStatus(429);
    const URL = req.originalUrl;
    const date = new Date();
    // @ts-ignore
    const limitList = limitListDB.filter(i => URL === i.URL && ip === i.ip && Math.abs(i.date - date) < 10000);
    if (limitList.length < 5) {
        limitListDB.push({ ip, URL, date });
        return next();
    }
    else {
        return res.sendStatus(429);
    }
});
exports.rateLimitMiddleware = rateLimitMiddleware;
