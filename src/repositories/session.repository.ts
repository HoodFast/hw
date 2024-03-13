import {tokensMetaCollection} from "../db/db";

import {ObjectId, WithId} from "mongodb";
import {jwtService} from "../application/jwt.service";
import {sessionMapper} from "../models/sessions/mappers/session-mappers";
import {SessionsOutputType} from "../models/sessions/output/session.output.type";
import {tokensMetaDbType} from "../models/tokens/token.db.model";


export class sessionRepository {

    static async getAllSessions(token: string): Promise<WithId<tokensMetaDbType>[] | null> {
        const metaData = await jwtService.getMetaDataByToken(token)
        if (!metaData) return null
        const userId = metaData.userId
        const result = await tokensMetaCollection.find({userId:new ObjectId(userId)}).toArray()
        if (!result) return null
        return result
    }

}