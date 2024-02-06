import {Response, Router} from "express";
import {authService} from "../services/auth.service";
import {RequestWithBody} from "../models/common/common";
import {AuthInputType} from "../models/auth/input/auth.input.model";
import {authValidation} from "../validators/auth-validators";

export const authRoute = Router({})

authRoute.post('/login',authValidation(), async (req:RequestWithBody<AuthInputType>,res:Response)=>{
    const loginOrEmail = req.body.loginOrEmail
    const password = req.body.password
    const authorisation = await authService.checkCredentials({loginOrEmail, password})
    if (!authorisation) {
        res.sendStatus(401)
        return
    }
    res.sendStatus(204)
})