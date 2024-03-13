import {ObjectId} from "mongodb";

export type tokensMetaDbType = {
    iat:Date
    expireDate:Date
    userId:ObjectId
    deviceId:string
    ip:string
    title:string
}