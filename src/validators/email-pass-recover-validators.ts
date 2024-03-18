import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {UserQueryRepository} from "../repositories/users.query.repository";



const emailPassRecoverValidator = body('email')
    .trim()
    .isString()
    .isLength({min: 1})
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Incorrect login')

export const emailPassRecoverValidation = ()=>[
    emailPassRecoverValidator,
    inputValidationMiddleware
]

