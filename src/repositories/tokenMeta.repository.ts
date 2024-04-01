import {ObjectId} from "mongodb";
import {tokensMetaDbType} from "../models/tokens/token.db.model";
import {tokenMetaModel} from "../db/db";


export class TokenMetaRepository {

    async setTokenMetaData(data: tokensMetaDbType): Promise<boolean> {

        await tokenMetaModel.insertMany(data)
        const TokenMeta = await this.getByDeviceId(data.deviceId)
        if (!TokenMeta) {
            return false
        }
        return !!TokenMeta
    }

    async getByDeviceId(deviceId: string) {
        const meta = await tokenMetaModel.findOne({deviceId})
        if (!meta) return null
        return meta
    }

    async getSessionForLogin(userId: ObjectId, title: string) {
        const meta = await tokenMetaModel.findOne({userId, title})
        return meta
    }

    async getSessionForRefresh(iat: Date, deviceId: string) {
        const meta = await tokenMetaModel.findOne({iat, deviceId})

        return meta
    }

    async deleteById(id: ObjectId) {
        const res = await tokenMetaModel.deleteOne({_id: new ObjectId(id)})
        return !!res.deletedCount
    }

    async deleteByDeviceId(deviceId: string) {
        const res = await tokenMetaModel.deleteOne({deviceId: deviceId})
        return !!res.deletedCount
    }
}