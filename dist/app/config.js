"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.appConfig = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    DB_TYPE: process.env.DB_TYPE,
    AC_SECRET: process.env.AC_SECRET,
    AC_TIME: process.env.AC_TIME,
    RT_TIME: process.env.AC_TIME,
    RT_SECRET: process.env.RT_SECRET,
    EMAIL: process.env.EMAIL,
    EMAIL_PASS: process.env.EMAIL_PASS
};
