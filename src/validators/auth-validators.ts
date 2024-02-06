import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";

const loginOrEmailValidator = body('loginOrEmail')
    .isString().withMessage('LoginOrEmail must be a string')
    .trim()
    .isLength({min: 1}).withMessage('Incorrect loginOrEmail')


const passwordValidator = body('password')
    .isString().withMessage('password must be a string')
    .trim()
    .isLength({min: 1}).withMessage('Incorrect password')


export const authValidation = ()=>[loginOrEmailValidator,passwordValidator,inputValidationMiddleware]