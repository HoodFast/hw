import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";



const contentValidator = body('content')
    .isString().withMessage('content must be a string')
    .trim()
    .isLength({min: 20, max: 300})
    .withMessage('Incorrect content')

export const commentsValidation = ()=>[
    contentValidator,
    inputValidationMiddleware
]

