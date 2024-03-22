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
exports.emailValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const users_query_repository_1 = require("../repositories/users.query.repository");
const emailValidator = (0, express_validator_1.body)('email')
    .trim()
    .isString()
    .isLength({ min: 1 })
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Incorrect login')
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_query_repository_1.UserQueryRepository.getByLoginOrEmail(email);
    if (!user) {
        throw new Error("The mail does not exist");
    }
    if (user.emailConfirmation.isConfirmed) {
        throw new Error("email is already confirmed");
    }
    return true;
}));
const emailValidation = () => [
    emailValidator,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.emailValidation = emailValidation;
