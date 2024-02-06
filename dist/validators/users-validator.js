"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidators = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const loginValidator = (0, express_validator_1.body)('login')
    .trim()
    .isString()
    .matches('^[a-zA-Z0-9_-]*$')
    .isLength({ min: 3, max: 10 }).withMessage('Incorrect login');
const passwordValidator = (0, express_validator_1.body)('password')
    .trim()
    .isString()
    .isLength({ min: 6, max: 20 })
    .withMessage('Incorrect password ');
const emailValidator = (0, express_validator_1.body)('email')
    .trim()
    .isString()
    .isLength({ min: 1 })
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Incorrect login');
const userValidators = () => [loginValidator, passwordValidator, emailValidator, input_validation_middleware_1.inputValidationMiddleware];
exports.userValidators = userValidators;
