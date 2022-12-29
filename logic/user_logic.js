const usersCollection = require('../models/user_model');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const userSignupValidation = require('./user_validation_logic');


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
            return res.status(400).json({ errorMessage: "Username Already Exists" });
        }

        //HASHING THE PASSWORD
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //CREATING A NEW USER IF NO RESPONSE WAS RETURNED WHICH MEANS DATA WAS VALIDATE
        let imagePath = (req.file) ? req.file.path : 'profile_images\\default_image.png';
        const insertedObject = await usersCollection({
            username: req.body.username,
            password: hashedPassword,
            profileImage: imagePath
        }).save();

        // SEND THE JWT IN THE HEADER TO THE CLIENT TO STORE IT
        //FIRST PARAMETER IS DATA THAT WILL BE RETURNED WHEN JWT.VERIFY IS CALLED

        //CREATE AND ASSIGN A TOKEN FOR THE USER
        const tokenPass = process.env.token_pass;
        const token = jwt.sign({ username: req.body.username, profileImage: imagePath },
            tokenPass, { expiresIn: "48h" });
        //TOKEN IS SENT IN THE HEADER OF THE RESPONSE
        res.header("user-token", token);
        res.status(200).json({ "successMessage": "Signed Up successfully" });

    }
    catch (error) {

        return res.status(400).json({ errorMessage: error });
    }


}

module.exports = signUp;