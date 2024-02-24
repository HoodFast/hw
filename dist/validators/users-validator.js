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
exports.userValidators = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const users_query_repository_1 = require("../repositories/users.query.repository");
const loginValidator = (0, express_validator_1.body)('login')
    .trim()
    .isString()
    .matches('^[a-zA-Z0-9_-]*$')
    .isLength({ min: 3, max: 10 }).withMessage('Incorrect login')
    .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_query_repository_1.UserQueryRepository.getByLoginOrEmail(login);
    if (user) {
        throw new Error("login already exist");
    }
    return true;
}));
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
    .withMessage('Incorrect login')
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_query_repository_1.UserQueryRepository.getByLoginOrEmail(email);
    if (user) {
        throw new Error("email already exist");
    }
    return true;
}));
const userValidators = () => [loginValidator, passwordValidator, emailValidator, input_validation_middleware_1.inputValidationMiddleware];
exports.userValidators = userValidators;
