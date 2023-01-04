const postsCollection = require('../models/post_model');
const usersCollection = require('../models/user_model');
const postsValidation = require('./posts_validation_logic');
var mongoose = require('mongoose');
const { response } = require('express');

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



async function incrementFakeVotes(req, res) {
    try {
        console.log("in here");
        const postID = req.body.postID;

        //INCREMENT VOTES BY ONE
        postsCollection.findByIdAndUpdate({ _id: postID }, { $inc: { 'fakeVotes': 1 } }, { new: true }, function (err, response) {
            if (err) {
                return res.status(400).json({
                    "errorMessage": err,
                    "statusCode": 400
                });
            } else {
                // INCREMENTION SUCCEEDED
                // ADD THE POST ID TO THE VOTER VOTED POSTS
                console.log(req.extractedUserData.userID);
                usersCollection.updateOne({ _id: req.extractedUserData.userID },
                    { $push: { votedPosts: postID } }, function (err, docs) {
                        if (err) {
                            return res.status(400).json({
                                "errorMessage": err,
                                "statusCode": 400
                            });
                        }
                        else {
                            console.log(docs);
                            return res.status(200).json({
                                "successMessage": "Voted Successfully",
                                "statusCode": 200
                            });
                        }
                    });
            }
        }
        );
    }

    catch (error) {
        console.log(error);
        return res.status(400).json({
            "errorMessage": error,
            "statusCode": 400
        });
    }

}


async function incrementOriginalVotes(req, res) {
    try {
        console.log("in here");
        const postID = req.body.postID;

        //INCREMENT VOTES BY ONE
        postsCollection.findByIdAndUpdate({ _id: postID }, { $inc: { 'originalVotes': 1 } }, { new: true }, function (err, response) {
            if (err) {
                return res.status(400).json({
                    "errorMessage": err,
                    "statusCode": 400
                });
            } else {
                // INCREMENTION SUCCEEDED
                // ADD THE POST ID TO THE VOTER VOTED POSTS TO PREVENT HIM FROM VOTING AGAIN
                console.log(req.extractedUserData.userID);
                usersCollection.updateOne({ _id: req.extractedUserData.userID },
                    { $push: { votedPosts: postID } }, function (err, docs) {
                        if (err) {
                            return res.status(400).json({
                                "errorMessage": err,
                                "statusCode": 400
                            });
                        }
                        else {
                            console.log(docs);
                            return res.status(200).json({
                                "successMessage": "Voted Successfully",
                                "statusCode": 200
                            });
                        }
                    });
            }
        }
        );
    }

    catch (error) {
        console.log(error);
        return res.status(400).json({
            "errorMessage": error,
            "statusCode": 400
        });
    }

}

module.exports = {
    uploadPostFunc: uploadPost, incrementFakeVotesFunc: incrementFakeVotes,
    incrementOriginalVotesFunc: incrementOriginalVotes,
};