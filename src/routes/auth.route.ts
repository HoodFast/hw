import {Response, Router} from "express";
import {authService} from "../services/auth.service";
import {RequestWithBody} from "../models/common/common";
import {AuthInputType} from "../models/auth/input/auth.input.model";
import {authValidation} from "../validators/auth-validators";
import {jwtService} from "../application/jwt.service";


export const authRoute = Router({})

authRoute.post('/login',authValidation(), async (req:RequestWithBody<AuthInputType>,res:Response)=>{

    const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (user) {
        const token =await jwtService.createJWT(user)
        return res.status(201).send({accessToken:token})
    }else{
        return res.sendStatus(401)
    }

})