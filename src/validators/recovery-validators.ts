import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";

const newPassValidator = body('newPassword')
    .isString().withMessage('LoginOrEmail must be a string')
    .trim()
    .isLength({min: 6,max:20}).withMessage('Incorrect newPassword')


const recoveryCodeValidator = body('recoveryCode')
    .isString().withMessage('password must be a string')
    .trim()
    .isLength({min: 1}).withMessage('Incorrect recoveryCode')


export const recoveryValidation = ()=>[newPassValidator,recoveryCodeValidator,inputValidationMiddleware]