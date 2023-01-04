const usersCollection = require('../models/user_model');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { userSignupValidation } = require('./user_validation_logic');
const { userLoginValidation } = require('./user_validation_logic');


async function signUp(req, res) {
    try {

        //VALIDATING THE DATA GIVEN IN BODY BEFORE CREATING A USER
        const registervalidationDetails = userSignupValidation(req.body);
        console.log(registervalidationDetails);
        if (registervalidationDetails.error != null) {
            return res.status(400).json({ errorMessage: registervalidationDetails.error.details[0].message });
        }
        //CHECKING IF THE USERNAME IS REPEATED 
        const usernameRepeated = await usersCollection.findOne({ username: req.body.username });
        if (usernameRepeated) {
            return res.status(400).json({
                "errorMessage": "Username Already Exists",
                "statusCode": 400
            });
        }

        //HASHING THE PASSWORD
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //CREATING A NEW USER IF NO RESPONSE WAS RETURNED WHICH MEANS DATA WAS VALIDATE
        let imagePath = (req.file) ? req.file.path : 'profile_images\\default_profile_image.png';
        const insertedObject = await usersCollection({
            username: req.body.username,
            password: hashedPassword,
            profileImage: imagePath
        }).save();

        // SEND THE JWT IN THE HEADER TO THE CLIENT TO STORE IT
        //FIRST PARAMETER IS DATA THAT WILL BE RETURNED WHEN JWT.VERIFY IS CALLED

        //CREATE AND ASSIGN A TOKEN FOR THE USER
        const tokenPass = process.env.token_pass;
        const token = jwt.sign({ username: req.body.username, userID: insertedObject._id },
            tokenPass, { expiresIn: "48h" });
        //TOKEN IS SENT IN THE HEADER OF THE RESPONSE
        res.header("user-token", token);
        res.status(200).json({
            "successMessage": "Signed Up successfully",
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



async function login(req, res) {
    try {
        //VALIDATING DATA ENTERED
        const validationDetails = userLoginValidation(req.body);
        console.log(req.body);
        if (validationDetails.error != null) {
            return res.status(400).json({
                "errorMessage": validationDetails.error.details[0].message,
                "statusCode": 400
            });
        }

        //CHECKING IF USERNAME EXISTS
        const userObj = await usersCollection.findOne({ username: req.body.username });
        if (userObj == null) {
            return res.status(400).json({
                "errorMessage": "User Not Found",
                "statusCode": 400
            });
        }
        //CHECKING IF PASSWORD IS CORRECT BCRYPT.COMPARE RETURNS BOOLEAN
        const passIsCorrect = await bcrypt.compare(req.body.password, userObj.password);
        if (passIsCorrect == false) {
            return res.status(400).json({
                "errorMessage": "Invalid Username Or Password",
                "statusCode": 400
            });
        }
        //AT THIS POINT SINCE NO ERROR RETURNED EVERYTHING SHOULD BE CORRECT
        //CREATE AND ASSIGN A TOKEN FOR THE USER
        const tokenPass = process.env.token_pass;
        const token = jwt.sign({ username: req.body.username, userID: userObj._id },
            tokenPass, { expiresIn: "48h" });
        //TOKEN IS SENT IN THE HEADER OF THE RESPONSE
        res.header("user-token", token);
        res.status(200).json({
            "successMessage": "Logged In successfully",
            "statusCode": 200
        });



    }
    catch (error) {
        console.log("error here now" + error);
        res.status(400).json({
            "errorMessage": error,
            "statusCode": 400
        });
    }

}

async function verifyUserToken(req, res) {
    const token = req.header('user-token');

    if (token == null) {
        return res.status(401).json({
            "errorMessage": "Access Denied",
            "statusCode": 401
        });
    }
    try {
        //Verify the token and extract the user data
        const extractedUserData = jwt.verify(token, process.env.token_pass);
        console.log("the extracted data:", extractedUserData);
        // if it didn't throw error it means token is valid
        res.status(200).json({
            "successMessage": "Token is successfully verified",
            "userID": extractedUserData.userID,
            "statusCode": 200
        })


    }
    catch (err) {
        res.status(401).json({
            "errorMessage": "Invalid Token",
            "statusCode": 401
        });
    }
}

module.exports = {
    signUpFunction: signUp,
    loginFunction: login,
    verifyUserTokenFunction: verifyUserToken
};