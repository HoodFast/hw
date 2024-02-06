"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const loginOrEmailValidator = (0, express_validator_1.body)('loginOrEmail')
    .isString().withMessage('LoginOrEmail must be a string')
    .trim()
    .isLength({ min: 1 }).withMessage('Incorrect loginOrEmail');
const passwordValidator = (0, express_validator_1.body)('password')
    .isString().withMessage('password must be a string')
    .trim()
    .isLength({ min: 1 }).withMessage('Incorrect password');
const authValidation = () => [loginOrEmailValidator, passwordValidator, input_validation_middleware_1.inputValidationMiddleware];
exports.authValidation = authValidation;
