const express = require('express');
const postsRouter = express.Router();
const upload = require('../logic/post_files_upload_logic');
const verifyUserTokenMiddleware = require('../logic/middlewares');
const uploadPostFunc = require('../logic/posts_logic');

//POST REQUESTS
postsRouter.post('/uploadPost', verifyUserTokenMiddleware, upload.single('postImage'), uploadPostFunc);


module.exports = postsRouter;