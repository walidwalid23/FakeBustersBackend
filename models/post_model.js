const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true
    },
    postImage: {
        type: String,
        required: true,

    },
    postDate: {
        type: Date,
        default: Date.now()
    },
    fakeVotes: {
        type: Number,
        required: true,
        default: 0
    },
    originalVotes: {
        type: Number,
        required: true,
        default: 0
    },

});



module.exports = mongoose.model("PostsCollection", postsSchema);