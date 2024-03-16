import {NextFunction, Request, Response} from "express";
import {blCollection, rateLimitsCollection} from "../../db/db";
import {add} from "date-fns/add";
import {rateLimitDbType} from "../../models/sessions/session.db.model";

let limitListDB: rateLimitDbType[] = []
export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {



    const ip = req.ip
    if (!ip) return res.sendStatus(429)
    const URL = req.originalUrl
    const date = new Date()
    const filterDate = add(new Date(), {seconds: -10})

    // @ts-ignore
    const limitList = limitListDB.filter(i => URL === i.URL && ip === i.ip && Math.abs(i.date - date) < 10000)
    // const limitList = await rateLimitsCollection.find(
    //     {
    //         $and: [
    //             {ip: ip},
    //             {URL: URL},
    //             {date: {$gt: filterDate}}
    //         ]
    //     })
    //     .toArray()
    // console.log(`${limitListDB} = ${limitList.length}`)

    if (limitList.length < 5) {
        // await rateLimitsCollection.insertOne({
        //     ip, URL, date
        // })
        limitListDB.push({ip, URL, date})
        return next()
    } else {
        // await rateLimitsCollection.deleteMany({ip: ip, URL: URL})
        return res.sendStatus(429)
    }

}