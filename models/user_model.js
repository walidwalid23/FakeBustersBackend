const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    profileImage: {
        type: String,
        required: true
    },

    votedPosts: [{ type: String, unique: true }],


});



module.exports = mongoose.model("UsersCollection", usersSchema);