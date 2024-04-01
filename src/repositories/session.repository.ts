

import {ObjectId, WithId} from "mongodb";
import {JwtService} from "../application/jwt.service";

import {tokensMetaDbType} from "../models/tokens/token.db.model";
import {tokenMetaModel} from "../db/db";


export class SessionRepository {
constructor(protected jwtService:JwtService) {
}
    async getAllSessions(token: string): Promise<WithId<tokensMetaDbType>[] | null> {
        const metaData = await this.jwtService.getMetaDataByToken(token)
        if (!metaData) return null
        const userId = metaData.userId
        const result = await tokenMetaModel.find({userId:new ObjectId(userId)}).lean()
        if (!result) return null
        return result
    }

}