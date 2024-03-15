import {TokenMetaRepository} from "../repositories/tokenMeta.repository";
import {sessionRepository} from "../repositories/session.repository";
import {jwtService} from "../application/jwt.service";
import {Result} from "../types/result.type";
import {ResultCode} from "../models/common/common";

export class securityService {
    static async deleteAllSessions(token: string) {
        const result = await sessionRepository.getAllSessions(token)
        if (!result) return false
        const tokenMetaData = await jwtService.getMetaDataByToken(token)
        if (!tokenMetaData) return false
        for (let i = 0; i < result.length; i++) {
            if (result[i].iat.toISOString() !== tokenMetaData.iat.toISOString()) {
                await TokenMetaRepository.deleteById(result[i]._id)
            }
        }
        return true
    }

    static async deleteSessionById(token: string, deviceId: string): Promise<Result> {
        const deviceIdCheck = await TokenMetaRepository.getByDeviceId(deviceId)
        if(!deviceIdCheck) return {code: ResultCode.Forbidden}
        const tokenMetaData = await jwtService.getMetaDataByToken(token)
        if (!tokenMetaData) return {code: ResultCode.Unauthorized}
        if (deviceId !== tokenMetaData.deviceId) return {code: ResultCode.Forbidden}
        const res = await TokenMetaRepository.deleteByDeviceId(deviceId)
        if (!res) return {code: ResultCode.NotFound}
        return {code: ResultCode.Success}
    }
}