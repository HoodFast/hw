import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";



const codeValidator = body('code')
    .isString().withMessage('code must be a string')
    .trim()
    .isLength({min: 1})
    .withMessage('Incorrect code')

export const codeValidation = ()=>[
    codeValidator,
    inputValidationMiddleware
]

