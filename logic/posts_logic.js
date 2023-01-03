const postsCollection = require('../models/post_model');
const postsValidation = require('./posts_validation_logic');


async function uploadPost(req, res) {
    try {
        //VALIDATING THE DATA GIVEN IN BODY BEFORE CREATING A USER
        const postsValidationDetails = postsValidation(req.body);
        console.log(req.body.productName);

        if (postsValidationDetails.error != null) {
            return res.status(400).json({ errorMessage: postsValidationDetails.error.details[0].message });
        }


        //CREATING A NEW POST IF NO RESPONSE WAS RETURNED WHICH MEANS DATA WAS VALIDATE
        let imagePath = req.file.path
        const insertedObject = await postsCollection({
            category: req.body.category,
            productName: req.body.productName,
            brandName: req.body.brandName,
            postImage: imagePath,
            uploaderID: req.extractedUserData.userID
        }).save();



        res.status(200).json({
            "successMessage": "Post Uploaded successfully",
            "statusCode": 200
        });

    }
    catch (error) {

        return res.status(400).json({
            "errorMessage": error,
            "statusCode": 400
        });
    }

}

module.exports = uploadPost;