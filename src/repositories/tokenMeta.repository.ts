import {ObjectId} from "mongodb";
import {tokensMetaDbType} from "../models/tokens/token.db.model";
import {tokenMetaModel} from "../db/db";


export class TokenMetaRepository {

    static async setTokenMetaData(data: tokensMetaDbType): Promise<boolean> {

        await tokenMetaModel.insertMany(data)
        const TokenMeta = await this.getByDeviceId(data.deviceId)
        if (!TokenMeta) {
            return false
        }
        return !!TokenMeta
    }

    static async getByDeviceId(deviceId: string) {
        const meta = await tokenMetaModel.findOne({deviceId})
        if (!meta) return null
        return meta
    }

    static async getSessionForLogin(userId: ObjectId, title: string) {
        const meta = await tokenMetaModel.findOne({userId, title})
        return meta
    }

    static async getSessionForRefresh(iat: Date, deviceId: string) {
        const meta = await tokenMetaModel.findOne({iat, deviceId})

        return meta
    }

    static async deleteById(id: ObjectId) {
        const res = await tokenMetaModel.deleteOne({_id: new ObjectId(id)})
        return !!res.deletedCount
    }

    static async deleteByDeviceId(deviceId: string) {
        const res = await tokenMetaModel.deleteOne({deviceId: deviceId})
        return !!res.deletedCount
    }
}