import {Router} from "express";
import {sessionQueryRepository} from "../repositories/session.query.repository";
import {securityService} from "../services/security.service";
import {RequestWithParams, ResultCode} from "../models/common/common";

export const securityRoute = Router({})


securityRoute.get('/devices', async (req, res) => {
    const token = req.cookies.refreshToken
    if (!token) return res.sendStatus(401)
    const result = await sessionQueryRepository.getAllSessions(token)
    if (!result) return res.sendStatus(404)
    return res.status(200).send(result)
})

securityRoute.delete('/devices', async (req, res) => {
    const token = req.cookies.refreshToken
    if (!token) return res.sendStatus(401)
    const result = await securityService.deleteAllSessions(token)
    if (!result) return res.sendStatus(404)
    return res.sendStatus(204)
})

securityRoute.delete('/devices/:deviceId', async (req: RequestWithParams<{ deviceId: string }>, res) => {

    const token = req.cookies.refreshToken
    if (!token) return res.sendStatus(401)
    const deviceId = req.params.deviceId.trim()
    if (!deviceId) return res.sendStatus(404)
    const result = await securityService.deleteSessionById(token, deviceId)

    switch (result.code) {
        case ResultCode.Success:
            return res.sendStatus(204)
        case ResultCode.Unauthorized:
            return res.sendStatus(401)
        case ResultCode.Forbidden:
            return res.sendStatus(403)
        case ResultCode.NotFound:
            return res.sendStatus(404)
        default:
            return res.sendStatus(404)
    }
})