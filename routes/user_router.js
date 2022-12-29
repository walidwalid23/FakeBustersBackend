const { Router } = require('express');
const express = require('express');
const userRouter = express.Router();
const signUpFunc = require('../logic/user_logic');
const upload = require('../logic/files_upload_logic');

//POST REQUESTS

//SIGN UP
userRouter.post('/signup', upload.single('profileImage'), signUpFunc);




module.exports = userRouter;