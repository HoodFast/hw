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
exports.codeValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const users_query_repository_1 = require("../repositories/users.query.repository");
const codeValidator = (0, express_validator_1.body)('code')
    .isString().withMessage('code must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Incorrect code')
    .custom((code) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_query_repository_1.UserQueryRepository.getByCode(code);
    if (!user)
        throw new Error('code doesnt exist');
    if (user.emailConfirmation.expirationDate < new Date())
        throw new Error('code is expiration');
    if (user.emailConfirmation.isConfirmed)
        throw new Error('code already confirmed');
    if (user.emailConfirmation.confirmationCode !== code)
        throw new Error('corrupted code');
    return true;
}));
const codeValidation = () => [
    codeValidator,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.codeValidation = codeValidation;
