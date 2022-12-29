const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema({
    commentText: {
        type: String,
        required: true,
    },

    commentDate: {
        type: Date,
        default: Date.now()
    },

    commenterID: {
        type: String,
        required: true,
    },

    postID: {
        type: String,
        required: true,
    },

    usefulness: {
        type: Number,
        required: true,
        default: 0
    },




});



module.exports = mongoose.model("CommentsCollection", commentsSchema);