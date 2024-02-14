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
exports.emailAdapter = void 0;
const nodemailer = require('nodemailer');
exports.emailAdapter = {
    sendEmail(email, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer.createTransport({
                host: "smtp.mail.ru",
                secure: true,
                port: 465,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                },
                tls: { rejectUnauthorized: false }
            });
            let info = yield transporter.sendMail({
                from: 'test <rabota-trassa@mail.ru>',
                to: email,
                subject,
                html: message
            });
            return info;
        });
    }
};
