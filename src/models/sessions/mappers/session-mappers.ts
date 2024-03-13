import {tokensMetaDbType} from "../../tokens/token.db.model";
import {WithId} from "mongodb";
import {SessionsOutputType} from "../output/session.output.type";


export const sessionMapper = (sessions: WithId<tokensMetaDbType>[]): SessionsOutputType[] => {
    const result = sessions.map(i => {
        return {
            ip: i.ip,
            title: i.title,
            lastActiveDate: i.iat,
            deviceId: i.deviceId,
        }
    })
    return result
}