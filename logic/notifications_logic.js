const notificationsCollection = require('../models/notification_model');


async function getUserNotifications(req, res) {
    try {

        let currentUserID = req.extractedUserData.userID;
        // FIND THE NOTIFICATIONS RECIEVED BY THE CURRENT USER
        var notifications = await notificationsCollection.find({ receiverID: currentUserID });

        return res.status(200).json({
            "successMessage": "Notifications Retrieved successfully",
            "notifications": notifications,
            "statusCode": 200
        });

    }

    catch (error) {

        console.log(error);
        return res.status(400).json({
            "errorMessage": error,
            "statusCode": 400
        });
    }

}

async function deleteNotification(req, res) {
    try {

        let notificationID = req.body.notificationID;
        // FIND THE NOTIFICATIONS RECIEVED BY THE CURRENT USER
        notificationsCollection.findByIdAndDelete(notificationID, function (err, docs) {
            if (err) {
                return res.status(400).json({
                    "errorMessage": err,
                    "statusCode": 400
                });

            }
            else {
                return res.status(200).json({
                    "successMessage": "Notification deleted successfully",
                    "statusCode": 200
                });
            }

        });
    }

    catch (error) {

        console.log(error);
        return res.status(400).json({
            "errorMessage": error,
            "statusCode": 400
        });
    }

}


module.exports = {
    getUserNotificationsFunc: getUserNotifications,
    deleteNotificationFunc: deleteNotification,

};