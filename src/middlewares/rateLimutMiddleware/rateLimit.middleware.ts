import {NextFunction, Request, Response} from "express";
import {blCollection, rateLimitsCollection} from "../../db/db";
import {add} from "date-fns/add";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip

    if (!ip) return res.sendStatus(429)
    const URL = req.baseUrl
    const date = new Date()
    const filterDate = add(new Date(), {seconds: -10})
    const blackList = await blCollection.find({ip, URL}).toArray()

    if (blackList.length > 0) {
        return res.sendStatus(429)
    }

    const limitList = await rateLimitsCollection.find({
        ip,
        URL,
        date: {$gt: filterDate}
    }).toArray()

    if (limitList.length < 5) {
        await rateLimitsCollection.insertOne({
            ip, URL, date
        })
        return next()
    } else {
        await blCollection.insertOne({ip, URL})
        await rateLimitsCollection.deleteMany({ip, URL})
        return res.sendStatus(429)
    }

}