const express = require('express');
const postsRouter = express.Router();
const upload = require('../logic/post_files_upload_logic');
const verifyUserTokenMiddleware = require('../logic/middlewares');
const { uploadPostFunc } = require('../logic/posts_logic');
const { incrementFakeVotesFunc } = require('../logic/posts_logic');
const { incrementOriginalVotesFunc } = require('../logic/posts_logic');
const { findPostsByCategoriesFunc } = require('../logic/posts_logic');
const { searchPostsByProductNameFunc } = require('../logic/posts_logic');
const { getVotesFunc } = require('../logic/posts_logic');

//POST REQUESTS
postsRouter.post('/uploadPost', verifyUserTokenMiddleware, upload.single('postImage'), uploadPostFunc);
postsRouter.post('/incrementFakeVotes', verifyUserTokenMiddleware, incrementFakeVotesFunc);
postsRouter.post('/incrementOriginalVotes', verifyUserTokenMiddleware, incrementOriginalVotesFunc);
postsRouter.post('/findPostsByCategories', verifyUserTokenMiddleware, findPostsByCategoriesFunc);
postsRouter.post('/searchPostsByProductName', verifyUserTokenMiddleware, searchPostsByProductNameFunc);
//GET REQUESTS
postsRouter.get('/getVotes', verifyUserTokenMiddleware, getVotesFunc);

module.exports = postsRouter;