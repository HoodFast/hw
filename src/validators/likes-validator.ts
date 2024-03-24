import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {UserQueryRepository} from "../repositories/users.query.repository";

const likesValidator = body('likeStatus')
    .trim()
    .isString()
    .custom((value) => {
        if (value === 'Like' || value === 'Dislike' || value === 'None') {
            return true;
        }else{
            throw new Error('incorrect status');
        }


    })



export const likesValidators = ()=>[likesValidator,inputValidationMiddleware]