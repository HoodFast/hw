"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoveryValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const newPassValidator = (0, express_validator_1.body)('newPassword')
    .isString().withMessage('newPassword must be a string')
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage('Incorrect newPassword');
const recoveryCodeValidator = (0, express_validator_1.body)('recoveryCode')
    .isString().withMessage('recoveryCode must be a string')
    .trim()
    .isLength({ min: 1 }).withMessage('Incorrect recoveryCode');
const recoveryValidation = () => [newPassValidator, recoveryCodeValidator, input_validation_middleware_1.inputValidationMiddleware];
exports.recoveryValidation = recoveryValidation;
