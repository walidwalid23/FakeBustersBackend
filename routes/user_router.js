const express = require('express');
const userRouter = express.Router();
const { signUpFunction } = require('../logic/user_logic');
const { loginFunction } = require('../logic/user_logic');
const { updateUserFunction } = require('../logic/user_logic');
const { verifyUserTokenFunction } = require('../logic/user_logic');
const verifyUserTokenMiddleware = require('../logic/middlewares');
const upload = require('../logic/user_files_upload_logic');


//POST REQUESTS

//SIGN UP
userRouter.post('/signup', upload.single('profileImage'), signUpFunction);

//LOGIN
userRouter.post('/login', loginFunction);

//UPDATE USER
userRouter.post('/update', verifyUserTokenMiddleware, updateUserFunction);

//VERIFY User TOKEN
userRouter.post('/verifyUserToken', verifyUserTokenFunction);



module.exports = userRouter;