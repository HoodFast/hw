

import {ObjectId, WithId} from "mongodb";
import {jwtService} from "../application/jwt.service";

import {tokensMetaDbType} from "../models/tokens/token.db.model";
import {tokenMetaModel} from "../db/db";


export class sessionRepository {

    static async getAllSessions(token: string): Promise<WithId<tokensMetaDbType>[] | null> {
        const metaData = await jwtService.getMetaDataByToken(token)
        if (!metaData) return null
        const userId = metaData.userId
        const result = await tokenMetaModel.find({userId:new ObjectId(userId)}).lean()
        if (!result) return null
        return result
    }

}