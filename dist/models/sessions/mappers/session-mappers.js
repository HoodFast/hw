"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMapper = void 0;
const sessionMapper = (sessions) => {
    const result = sessions.map(i => {
        return {
            ip: i.ip,
            title: i.title,
            lastActiveDate: i.iat,
            deviceId: i.deviceId,
        };
    });
    return result;
};
exports.sessionMapper = sessionMapper;
