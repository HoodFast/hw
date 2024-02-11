"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const contentValidator = (0, express_validator_1.body)('content')
    .isString().withMessage('content must be a string')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Incorrect content');
const commentsValidation = () => [
    contentValidator,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.commentsValidation = commentsValidation;
