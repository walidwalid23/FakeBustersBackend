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
    brandName: {
        type: String,
        required: true
    },
    postImage: {
        type: String,
        required: true,
    },
    postDate: {
        type: Date,
        default: Date.now
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

    uploaderID: {
        type: String,
        required: true,
    },

    uploaderNotificationToken: {
        type: String,
        required: true,
    },

});



module.exports = mongoose.model("PostsCollection", postsSchema);