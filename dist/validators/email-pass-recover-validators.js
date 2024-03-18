"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailPassRecoverValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const emailPassRecoverValidator = (0, express_validator_1.body)('email')
    .trim()
    .isString()
    .isLength({ min: 1 })
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Incorrect login');
const emailPassRecoverValidation = () => [
    emailPassRecoverValidator,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.emailPassRecoverValidation = emailPassRecoverValidation;
