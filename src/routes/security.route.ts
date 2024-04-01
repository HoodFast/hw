import "reflect-metadata"
import {Request, Response, Router} from "express";
import {SessionQueryRepository} from "../repositories/session.query.repository";
import {SecurityService} from "../services/security.service";
import {RequestWithParams, ResultCode} from "../models/common/common";
import {container} from "../composition-root";
import {injectable} from "inversify";


export const securityRoute = Router({})
@injectable()
export class SecurityController {
    constructor(protected sessionQueryRepository: SessionQueryRepository,
                protected securityService: SecurityService) {
    }

    async getAllSessions(req: Request, res: Response) {
        const token = req.cookies.refreshToken
        if (!token) return res.sendStatus(401)
        const result = await this.sessionQueryRepository.getAllSessions(token)
        if (!result) return res.sendStatus(404)
        return res.status(200).send(result)
    }

    async deleteAllSession(req: Request, res: Response) {
        const token = req.cookies.refreshToken
        if (!token) return res.sendStatus(401)
        const result = await this.securityService.deleteAllSessions(token)
        if (!result) return res.sendStatus(404)
        return res.sendStatus(204)
    }

    async deleteSessionById(req: RequestWithParams<{ deviceId: string }>, res: Response) {

        const token = req.cookies.refreshToken
        if (!token) return res.sendStatus(401)
        const deviceId = req.params.deviceId.trim()
        if (!deviceId) return res.sendStatus(404)
        const result = await this.securityService.deleteSessionById(token, deviceId)

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
    }
}

const securityController = container.resolve<SecurityController>(SecurityController)

securityRoute.get('/devices', securityController.getAllSessions.bind(securityController))

securityRoute.delete('/devices', securityController.deleteAllSession.bind(securityController))

securityRoute.delete('/devices/:deviceId',securityController.deleteSessionById.bind(securityController))