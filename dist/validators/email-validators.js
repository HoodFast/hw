"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const emailValidator = (0, express_validator_1.body)('email')
    .trim()
    .isString()
    .isLength({ min: 1 })
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Incorrect login');
const emailValidation = () => [
    emailValidator,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.emailValidation = emailValidation;
