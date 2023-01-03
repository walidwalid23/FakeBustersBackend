const jwt = require("jsonwebtoken");
function verifyUserTokenMiddleware(req, res, next) {
    try {
        const token = req.header('user-token');
        console.log(token);
        if (token == null) {
            return res.status(401).json({
                "errorMessage": "Access Denied",
                "statusCode": 401
            });
        }

        console.log("in here");
        //Verify the token and extract the user data
        console.log(process.env.token_pass);
        const extractedUserData = jwt.verify(token, process.env.token_pass);
        console.log("the extracted data:", extractedUserData);
        // if it didn't throw error it means token is valid
        req.extractedUserData = extractedUserData;
        // go to next route
        next();

    }
    catch (err) {
        console.log(err);
        res.status(401).json({
            "errorMessage": "Invalid Token",
            "statusCode": 401
        });
    }
}



module.exports = verifyUserTokenMiddleware;