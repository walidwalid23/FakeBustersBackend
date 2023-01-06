const express = require('express');
const appServer = express();
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv/config");
const userRouter = require('./routes/user_router');
const postsRouter = require('./routes/posts_router');

//RUN THE SERVER
appServer.listen(3000, () => {
    console.log("Sever Is Listening");
});
//CONNECT TO THE DATABASE
mongoose.connect(process.env.db_connection, (error) => {
    if (error) { console.log("ERROR CONNECTING TO MONGOOSE:" + error); }
    else {
        console.log("Connected to local MONGO DB");
    }
});

//BODY PARSER MIDDLEWARE (DECODE JSON BODY TO JS OBJECT)
appServer.use("/", express.json());
appServer.use(express.urlencoded({ extended: true }));
//cors allow requests to be sent to the server from another networks than the local network
appServer.use(cors());
//MAKING THE PROFILE AND POSTS IMAGES FOLDER AVAILABLE FOR ANYONE TO ACCESS THE FILES INSIDE IT
appServer.use('/profile_images', express.static('profile_images'));
appServer.use('/posts_images', express.static('posts_images'));


//MAIN ROUTES
appServer.use('/users', userRouter);
appServer.use('/posts', postsRouter);

