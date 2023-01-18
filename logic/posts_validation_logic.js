const joi = require("joi");

function postsValidation(reqBody) {

    const postsValidSchema = joi.object({
        productName: joi.string().max(60).required(),
        brandName: joi.string().max(60).required(),
        category: joi.string().max(40).required(),
        uploaderNotificationToken: joi.string().required(),
    });

    const postsValidationDetails = postsValidSchema.validate(reqBody);
    return postsValidationDetails;
}

module.exports = postsValidation;