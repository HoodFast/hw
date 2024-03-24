"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesValidators = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const likesValidator = (0, express_validator_1.body)('likeStatus')
    .trim()
    .isString()
    .custom((value) => {
    if (value === 'Like' || value === 'Dislike' || value === 'None') {
        return true;
    }
    else {
        throw new Error('incorrect status');
    }
});
const likesValidators = () => [likesValidator, input_validation_middleware_1.inputValidationMiddleware];
exports.likesValidators = likesValidators;
