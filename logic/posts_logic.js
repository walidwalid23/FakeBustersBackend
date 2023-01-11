const postsCollection = require('../models/post_model');
const usersCollection = require('../models/user_model');
const notificationsCollection = require('../models/notification_model');
const postsValidation = require('./posts_validation_logic');


async function uploadPost(req, res) {
    try {
        //VALIDATING THE DATA GIVEN IN BODY BEFORE CREATING A USER
        const postsValidationDetails = postsValidation(req.body);


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
            "uploaderUsername": req.extractedUserData.username,
            "uploaderImage": req.extractedUserData.profileImage,
            "postID": insertedObject._id,
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

async function findPostsByCategories(req, res) {
    try {

        // this is a list of categories
        let categories = req.body.categories;
        // if categories is undefined
        if (!categories) {
            return res.status(400).json({ errorMessage: "No Categories Were Given" });
        }

        //FINDING POSTS BY THE GIVEN CATEGORIES
        var retrievedPosts = [];
        for (let i = 0; i < categories.length; i++) {

            var eachCategoryPosts = await postsCollection.find({ category: categories[i] });
            var objectPosts = [];
            //iterate over each post
            for (let j = 0; j < eachCategoryPosts.length; j++) {
                //NOTE: Mongoose document doesn't allow adding properties so convert the returned document to a plain object 
                let postUploader = await usersCollection.findById(eachCategoryPosts[j].uploaderID);
                var postObject = eachCategoryPosts[j].toObject();


                // add the user attributes to each post object
                postObject.uploaderUsername = postUploader.username;
                postObject.uploaderImage = postUploader.profileImage;
                // CHECK IF THE CURRENT USER ALREADY VOTED OR NOT
                let currentUser = await usersCollection.findById(req.extractedUserData.userID);
                let currentUserVotedPostsIDs = currentUser.votedPosts;

                const foundVoted = currentUserVotedPostsIDs.find(function (votedPostID) {

                    return votedPostID == postObject._id;
                });

                if (foundVoted) {
                    postObject.hasCurrentUserVoted = true;
                }

                else {
                    postObject.hasCurrentUserVoted = false;
                }
                // CHECK IF THE CURRENT USER IS THE ONE WHO UPLOADED THE POST OR NOT
                let currentUserID = req.extractedUserData.userID;
                let postUploaderID = eachCategoryPosts[j].uploaderID;
                if (currentUserID == postUploaderID) {
                    postObject.isCurrentUserUploader = true;
                }
                else {
                    postObject.isCurrentUserUploader = false;
                }

                objectPosts.push(postObject);
            }
            //   console.log(eachCategoryPosts);

            retrievedPosts = retrievedPosts.concat(objectPosts);


        }


        if (retrievedPosts.length == 0) {
            return res.status(400).json({
                "errorMessage": "No Posts Were Found",
                "statusCode": 400
            });
        }

        res.status(200).json({
            "successMessage": "Posts Retrieved successfully",
            "posts": retrievedPosts,
            "statusCode": 200
        });

    }
    catch (error) {
        console.log("error occured");
        console.log(error);
        return res.status(400).json({
            "errorMessage": error,
            "statusCode": 400
        });
    }

}


async function searchPostsByProductName(req, res) {
    try {
        // this is a list of categories
        let givenProductName = req.query.productName;
        // if productName is undefined
        if (!givenProductName) {
            return res.status(400).json({
                "errorMessage": "No productName Was Given",
                "statusCode": 400
            });
        }

        //FINDING POSTS BY THE GIVEN CATEGORIES
        let retrievedPosts = await postsCollection.find({ productName: { $regex: '.*' + givenProductName + '.*' } });
        // PUT THE POSTS IN ANOTHER LIST WITH THE EXTRA ATTRIBUTES FOR EACH POST OBJECT
        var objectPosts = [];
        //iterate over each post
        for (let j = 0; j < retrievedPosts.length; j++) {
            //NOTE: Mongoose document doesn't allow adding properties so convert the returned document to a plain object 
            let postUploader = await usersCollection.findById(retrievedPosts[j].uploaderID);
            var postObject = retrievedPosts[j].toObject();


            // add the user attributes to each post object
            postObject.uploaderUsername = postUploader.username;
            postObject.uploaderImage = postUploader.profileImage;
            // CHECK IF THE CURRENT USER ALREADY VOTED OR NOT
            let currentUser = await usersCollection.findById(req.extractedUserData.userID);
            let currentUserVotedPostsIDs = currentUser.votedPosts;

            const foundVoted = currentUserVotedPostsIDs.find(function (votedPostID) {

                return votedPostID == postObject._id;
            });

            if (foundVoted) {
                postObject.hasCurrentUserVoted = true;
            }

            else {
                postObject.hasCurrentUserVoted = false;
            }
            // CHECK IF THE CURRENT USER IS THE ONE WHO UPLOADED THE POST OR NOT
            let currentUserID = req.extractedUserData.userID;
            let postUploaderID = retrievedPosts[j].uploaderID;
            if (currentUserID == postUploaderID) {
                postObject.isCurrentUserUploader = true;
            }
            else {
                postObject.isCurrentUserUploader = false;
            }

            objectPosts.push(postObject);
        }


        if (retrievedPosts.length == 0) {
            return res.status(400).json({
                "errorMessage": "No Posts Were Found",
                "statusCode": 400
            });
        }

        res.status(200).json({
            "successMessage": "Posts Retrieved successfully",
            "posts": objectPosts,
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



async function searchPostsByID(req, res) {
    try {
        // this is a list of categories
        let postID = req.query.postID;
        // if productName is undefined
        if (!postID) {
            return res.status(400).json({
                errorMessage: "No postID Was Given",
                statusCode: 400
            });
        }

        //FINDING POSTS BY THE GIVEN CATEGORIES
        let retrievedPost = await postsCollection.findById(postID);
        if (!retrievedPost) {
            return res.status(400).json({
                errorMessage: "Post Not Found",
                statusCode: 400
            });


        }

        //NOTE: Mongoose document doesn't allow adding properties so convert the returned document to a plain object 
        let postUploader = await usersCollection.findById(retrievedPost.uploaderID);
        var postObject = retrievedPost.toObject();

        // add the user attributes to each post object
        postObject.uploaderUsername = postUploader.username;
        postObject.uploaderImage = postUploader.profileImage;
        // CHECK IF THE CURRENT USER ALREADY VOTED OR NOT
        let currentUser = await usersCollection.findById(req.extractedUserData.userID);
        let currentUserVotedPostsIDs = currentUser.votedPosts;

        const foundVoted = currentUserVotedPostsIDs.find(function (votedPostID) {

            return votedPostID == postObject._id;
        });

        if (foundVoted) {
            postObject.hasCurrentUserVoted = true;
        }
        else {
            postObject.hasCurrentUserVoted = false;
        }

        // THE CURRENT USER IS THE ONE WHO UPLOADED THE POST 
        postObject.isCurrentUserUploader = true;


        res.status(200).json({
            "successMessage": "Post Retrieved successfully",
            "post": postObject,
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


async function deletePostByID(req, res) {
    try {
        // this is a list of categories
        let postID = req.body.postID;
        // if productName is undefined
        if (!postID) {
            return res.status(400).json({ errorMessage: "No postID Was Given" });
        }

        //DELETE POST BY ID
        await postsCollection.deleteOne({ _id: postID });

        res.status(200).json({
            "successMessage": "Post Deleted successfully",
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

        const postID = req.body.postID;

        //INCREMENT VOTES BY ONE
        postsCollection.findByIdAndUpdate({ _id: postID }, { $inc: { 'fakeVotes': 1 } },
            { new: true }, function (err, updatedPost) {
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
                        { $push: { votedPosts: postID } }, { new: true }, async function (err, updatedCollection) {
                            if (err) {
                                return res.status(400).json({
                                    "errorMessage": err,
                                    "statusCode": 400
                                });
                            }
                            else {
                                //SUCCESS
                                // NOTIFY THE POST OWNER
                                const notifierUsername = req.extractedUserData.username;
                                const notifierID = req.extractedUserData.userID;

                                const insertedNotification = await notificationsCollection({
                                    notificationText: notifierUsername + " Has Voted Fake On Your Post",
                                    receiverID: updatedPost.uploaderID,
                                    postID: postID,
                                    notifierID: notifierID

                                }).save();

                                console.log(updatedPost);
                                return res.status(200).json({
                                    "successMessage": "Voted Successfully",
                                    "fakeVotes": updatedPost.fakeVotes,
                                    "originalVotes": updatedPost.originalVotes,
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

        const postID = req.body.postID;

        //INCREMENT VOTES BY ONE
        postsCollection.findByIdAndUpdate({ _id: postID }, { $inc: { 'originalVotes': 1 } },
            { new: true }, function (err, updatedPost) {
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
                        { $push: { votedPosts: postID } }, { new: true }, async function (err, updatedCollection) {
                            if (err) {
                                return res.status(400).json({
                                    "errorMessage": err,
                                    "statusCode": 400
                                });
                            }
                            else {
                                //SUCCESS
                                // NOTIFY THE POST OWNER
                                const notifierUsername = req.extractedUserData.username;
                                const notifierID = req.extractedUserData.userID;

                                const insertedNotification = await notificationsCollection({
                                    notificationText: notifierUsername + " Has Voted Original On Your Post",
                                    receiverID: updatedPost.uploaderID,
                                    postID: postID,
                                    notifierID: notifierID

                                }).save();

                                console.log(updatedPost);
                                return res.status(200).json({
                                    "successMessage": "Voted Successfully",
                                    "fakeVotes": updatedPost.fakeVotes,
                                    "originalVotes": updatedPost.originalVotes,
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

async function getVotes(req, res) {
    try {

        const postID = req.query.postID;
        //INCREMENT VOTES BY ONE
        const post = await postsCollection.findById(postID);
        console.log(postID);
        return res.status(200).json({
            "successMessage": "Votes Retrived Successfully",
            "fakeVotes": post.fakeVotes,
            "originalVotes": post.originalVotes,
        });

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
    uploadPostFunc: uploadPost,
    incrementFakeVotesFunc: incrementFakeVotes,
    incrementOriginalVotesFunc: incrementOriginalVotes,
    findPostsByCategoriesFunc: findPostsByCategories,
    searchPostsByProductNameFunc: searchPostsByProductName,
    getVotesFunc: getVotes,
    searchPostsByIDFunc: searchPostsByID,
    deletePostByIDFunc: deletePostByID

};