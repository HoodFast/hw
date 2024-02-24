import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {UserQueryRepository} from "../repositories/users.query.repository";

const loginValidator = body('login')
    .trim()
    .isString()
    .matches('^[a-zA-Z0-9_-]*$')
    .isLength({min: 3, max: 10}).withMessage('Incorrect login')
    .custom(
        async (login:string)=>{
            const user = await UserQueryRepository.getByLoginOrEmail(login)
            if(user){
                throw new Error("login already exist")
            }
            return true
        }
    )

const passwordValidator = body('password')
    .trim()
    .isString()
    .isLength({min: 6, max: 20})
    .withMessage('Incorrect password ')

const emailValidator = body('email')
    .trim()
    .isString()
    .isLength({min: 1})
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Incorrect login')
    .custom(
        async (email:string)=>{
            const user = await UserQueryRepository.getByLoginOrEmail(email)
            if(user){
                throw new Error("email already exist")
            }
            return true
        }
    )


export const userValidators = ()=>[loginValidator,passwordValidator,emailValidator,inputValidationMiddleware]