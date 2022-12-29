const express = require('express');
const appServer = express();
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv/config");
const userRouter = require('./routes/user_router');

//RUN THE SERVER
appServer.listen(80, () => {
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
//MAKING THE PROFILE IMAGES FOLDER AVAILABLE FOR ANYONE TO ACCESS THE FILES INSIDE IT
appServer.use('/profile_images', express.static('profile_images'));

//MAIN ROUTES
appServer.use('/users', userRouter);

