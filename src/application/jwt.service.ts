import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {WithId} from "mongodb";
import {appConfig} from "../app/config";
import {UserRepository} from "../repositories/user.repository";
import {randomUUID} from "crypto";
import {tokensMetaDbType} from "../models/tokens/token.db.model";


import {TokenMetaRepository} from "../repositories/tokenMeta.repository";

let jwt = require('jsonwebtoken');

export class jwtService {
    static async createJWT(user: WithId<UsersTypeDb>): Promise<string> {
        const token = jwt.sign({userId: user._id}, appConfig.AC_SECRET, {expiresIn: appConfig.AC_TIME})
        return token
    }

    static async getMetaDataByToken(token: string) {
        try {
            const result = jwt.verify(token, appConfig.RT_SECRET)
            const decoded = jwt.decode(token, {complete: true})
            const userId = decoded.payload.userId
            const iat = new Date(decoded.payload.iat * 1000);
            const deviceId = result.deviceId
            return {iat, deviceId, userId}
        } catch (e) {
            return null
        }

    }

    static async createRefreshJWT(user: WithId<UsersTypeDb>, ip: string, title: string): Promise<string | null> {
        const userId = user._id
        const deviceId = randomUUID()
        const token = jwt.sign({userId, deviceId}, appConfig.RT_SECRET, {expiresIn: appConfig.RT_TIME})
        const decoded = jwt.decode(token, {complete: true})
        const iat = new Date(decoded.payload.iat * 1000);
        const tokenMetaData: tokensMetaDbType = {
            iat,
            deviceId,
            expireDate: decoded.payload.exp,
            userId,
            ip,
            title,
        }
        const setTokenMetaData = await TokenMetaRepository.setTokenMetaData(tokenMetaData)
        if (!setTokenMetaData) return null
        return token
    }

    static async getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, appConfig.AC_SECRET)
            const blackList = await UserRepository.getBlackList(result.userId)
            if (blackList?.includes(token)) return null
            return result.userId
        } catch (err) {
            return null
        }
    }

    static async checkRefreshToken(token: string) {
        try {
            const result = jwt.verify(token, appConfig.RT_SECRET)
            const blackList = await UserRepository.getBlackList(result.userId)
            if (blackList?.includes(token)) return null
            const user = await UserRepository.getUserById(result.userId)
            return user
        } catch (err) {
            return null
        }
    }

    static async getUserIdByRefreshToken(token: string) {
        try {
            const result = jwt.verify(token, appConfig.RT_SECRET)
            const blackList = await UserRepository.getBlackList(result.userId)
            if (blackList?.includes(token)) return null
            return result.userId
        } catch (err) {
            return null
        }
    }
}