import {body} from "express-validator";

const loginValidator = body('login')
    .trim()
    .isString()
    .matches('^[a-zA-Z0-9_-]*$')
    .isLength({min: 3, max: 10}).withMessage('Incorrect login')

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


export const userValidators = ()=>[loginValidator,passwordValidator,emailValidator]