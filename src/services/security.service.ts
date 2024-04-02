import {TokenMetaRepository} from "../repositories/tokenMeta.repository";
import {SessionRepository} from "../repositories/session.repository";
import {Result} from "../types/result.type";
import {ResultCode} from "../models/common/common";
import {injectable} from "inversify";
import {JwtService} from "../application/jwt.service";
@injectable()
export class SecurityService {
    constructor(
        protected sessionRepository: SessionRepository,
        protected tokenMetaRepository: TokenMetaRepository,
        protected jwtService:JwtService
    ) {
    }

    async deleteAllSessions(token: string) {
        const result = await this.sessionRepository.getAllSessions(token)
        if (!result) return false
        const tokenMetaData = await this.jwtService.getMetaDataByToken(token)
        if (!tokenMetaData) return false
        for (let i = 0; i < result.length; i++) {
            if (result[i].iat.toISOString() !== tokenMetaData.iat.toISOString()) {
                await this.tokenMetaRepository.deleteById(result[i]._id)
            }
        }
        return true
    }

    async deleteSessionById(token: string, deviceId: string): Promise<Result> {
        const sessionMetaData = await this.tokenMetaRepository.getByDeviceId(deviceId)
        if (!sessionMetaData) return {code: ResultCode.NotFound}
        const tokenMetaData = await this.jwtService.getMetaDataByToken(token)

        if (!tokenMetaData) return {code: ResultCode.Unauthorized}

        if (tokenMetaData?.userId != sessionMetaData.userId) {

            return {code: ResultCode.Forbidden}
        }
        const res = await this.tokenMetaRepository.deleteByDeviceId(deviceId)
        if (!res) return {code: ResultCode.NotFound}
        return {code: ResultCode.Success}
    }
}