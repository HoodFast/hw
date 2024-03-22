"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostFromBlogValidation = exports.postValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const blog_query_repository_1 = require("../repositories/blog.query.repository");
const titleValidator = (0, express_validator_1.body)('title')
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Incorrect title');
const shortDescriptionValidator = (0, express_validator_1.body)('shortDescription')
    .isString().withMessage('ShortDescription must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Incorrect shortDescription');
const contentValidator = (0, express_validator_1.body)('content')
    .isString().withMessage('Content must be a string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Incorrect content');
const blogIdValidator = (0, express_validator_1.body)('blogId')
    .isString().withMessage('websiteUrl must be a string')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const blogRepo = new blog_query_repository_1.BlogQueryRepository();
    const blog = yield blogRepo.getById(value);
    if (!blog) {
        throw Error('Incorrect blogId');
    }
    return true;
}))
    .withMessage('Incorrect blogId');
const postValidation = () => [
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.postValidation = postValidation;
const createPostFromBlogValidation = () => [
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.createPostFromBlogValidation = createPostFromBlogValidation;
