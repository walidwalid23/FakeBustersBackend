const mongoose = require("mongoose");

const notificationsSchema = mongoose.Schema({
    notificationText: {
        type: String,
        required: true,
    },

    notificationDate: {
        type: Date,
        default: Date.now()
    },

    receiverID: {
        type: String,
        required: true,
    },

    postID: {
        type: String,
        required: true,
    },

});



module.exports = mongoose.model("notificationsCollection", notificationsSchema);