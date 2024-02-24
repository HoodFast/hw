import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {UserQueryRepository} from "../repositories/users.query.repository";



const emailValidator = body('email')
    .trim()
    .isString()
    .isLength({min: 1})
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Incorrect login')
    .custom(
        async (email:string)=>{
            const user = await UserQueryRepository.getByLoginOrEmail(email)
            if(!user){
                throw new Error("The mail does not exist")
            }
            if(user.emailConfirmation.isConfirmed){
                throw new Error("email is already confirmed")
            }
            return true
        }
    )
export const emailValidation = ()=>[
    emailValidator,
    inputValidationMiddleware
]

