const joi = require("joi");

//USER SIGN UP VALIDATION
function userSignupValidation(reqBody) {

    const signupValidSchema = joi.object({
        username: joi.string().min(3).max(50).required(),
        password: joi.string().min(8).max(50).required(),

    });

    const signupValidationDetails = signupValidSchema.validate(reqBody);
    return signupValidationDetails;
}

//USER SIGN UP VALIDATION
function userLoginValidation(reqBody) {

    const loginValidSchema = joi.object({
        username: joi.string().min(3).max(50).required(),
        password: joi.string().min(8).max(50).required(),

    });

    const loginValidationDetails = loginValidSchema.validate(reqBody);
    return loginValidationDetails;
}


module.exports = {
    "userSignupValidation": userSignupValidation,
    "userLoginValidation": userLoginValidation
};