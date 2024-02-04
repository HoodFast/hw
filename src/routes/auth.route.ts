import {Router} from "express";
import {authService} from "../services/auth.service";
import {RequestWithBody} from "../models/common/common";
import {AuthInputType} from "../models/auth/input/auth.input.model";

export const authRoute = Router({})

authRoute.post('/login', async (req:RequestWithBody<AuthInputType>,res)=>{
    const loginOrEmail = req.body.loginOrEmail
    const password = req.body.password
    const authorisation = await authService.checkCredentials({loginOrEmail, password})
    if (!authorisation) {
        res.sendStatus(401)
        return
    }
    res.sendStatus(204)
})