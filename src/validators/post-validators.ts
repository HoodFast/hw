import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {BlogQueryRepository} from "../repositories/blog.query.repository";

const titleValidator = body('title')
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('Incorrect title')


const shortDescriptionValidator = body('shortDescription')
    .isString().withMessage('ShortDescription must be a string')
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('Incorrect shortDescription')

const contentValidator = body('content')
    .isString().withMessage('Content must be a string')
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('Incorrect content')

const blogIdValidator = body('blogId')
    .isString().withMessage('websiteUrl must be a string')
    .custom(async (value)=>{
        const blogRepo = new BlogQueryRepository()
        const blog =await blogRepo.getById(value)

        if(!blog){
             throw Error('Incorrect blogId')
        }
        return true
    })
    .withMessage('Incorrect blogId')


export const postValidation = ()=>[
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator,
    inputValidationMiddleware
]

export const createPostFromBlogValidation = ()=>[
    titleValidator,
        shortDescriptionValidator,
        contentValidator,
        inputValidationMiddleware
]