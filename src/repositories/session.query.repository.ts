
import {ObjectId,} from "mongodb";
import {jwtService} from "../application/jwt.service";
import {sessionMapper} from "../models/sessions/mappers/session-mappers";
import {SessionsOutputType} from "../models/sessions/output/session.output.type";
import {tokenMetaModel} from "../db/db";


export class sessionQueryRepository {

    static async getAllSessions(token: string): Promise<SessionsOutputType[] | null> {
        const metaData = await jwtService.getMetaDataByToken(token)
        if (!metaData) return null
        const userId = metaData.userId
        const result = await tokenMetaModel.find({userId:new ObjectId(userId)}).lean()
        if (!result) return null
        return sessionMapper(result)
    }

}