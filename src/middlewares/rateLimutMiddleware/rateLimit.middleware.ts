import {NextFunction, Request, Response} from "express";
import {rateLimitDbType} from "../../models/sessions/session.db.model";

let limitListDB: rateLimitDbType[] = []
export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const ip = req.ip
    if (!ip) return res.sendStatus(429)
    const URL = req.originalUrl
    const date = new Date()

    // @ts-ignore
    const limitList = limitListDB.filter(i => URL === i.URL && ip === i.ip && Math.abs(i.date - date) < 10000)

    if (limitList.length < 5) {

        limitListDB.push({ip, URL, date})
        return next()
    } else {

        return res.sendStatus(429)
    }

}