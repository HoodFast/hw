import {ObjectId,} from "mongodb";
import {JwtService} from "../application/jwt.service";
import {sessionMapper} from "../models/sessions/mappers/session-mappers";
import {SessionsOutputType} from "../models/sessions/output/session.output.type";
import {tokenMetaModel} from "../db/db";
import {injectable} from "inversify";

@injectable()
export class SessionQueryRepository {

    constructor(protected jwtService: JwtService) {
    }

    async getAllSessions(token: string): Promise<SessionsOutputType[] | null> {
        const metaData = await this.jwtService.getMetaDataByToken(token)
        if (!metaData) return null
        const userId = metaData.userId
        const result = await tokenMetaModel.find({userId: new ObjectId(userId)}).lean()
        if (!result) return null
        return sessionMapper(result)
    }

}