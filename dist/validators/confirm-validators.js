"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const codeValidator = (0, express_validator_1.body)('code')
    .isString().withMessage('code must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Incorrect code');
const codeValidation = () => [
    codeValidator,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.codeValidation = codeValidation;
