const { Router } = require('express');
const express = require('express');
const userRouter = express.Router();
const { signUpFunction } = require('../logic/user_logic');
const { loginFunction } = require('../logic/user_logic');
const upload = require('../logic/files_upload_logic');

//POST REQUESTS

//SIGN UP
userRouter.post('/signup', upload.single('profileImage'), signUpFunction);

//LOGIN
userRouter.post('/login', loginFunction);


module.exports = userRouter;