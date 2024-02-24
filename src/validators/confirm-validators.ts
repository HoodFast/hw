import {body, query} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {UserQueryRepository} from "../repositories/users.query.repository";
import {ResultCode} from "../models/common/common";


const codeValidator = body('code')
    .isString().withMessage('code must be a string')
    .trim()
    .isLength({min: 1})
    .withMessage('Incorrect code')
    .custom(async (code:string)=>{
        const user = await UserQueryRepository.getByCode(code)
        if (!user) throw new Error('code doesnt exist')

        if (user.emailConfirmation.expirationDate < new Date()) throw new Error('code is expiration')

        if (user.emailConfirmation.isConfirmed) throw new Error('code already confirmed')

        if (user.emailConfirmation.confirmationCode !== code) throw new Error('corrupted code')
        return true
    })

export const codeValidation = ()=>[
    codeValidator,
    inputValidationMiddleware
]

