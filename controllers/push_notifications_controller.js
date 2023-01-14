var admin = require("firebase-admin");
var fcm = require("fcm-notification");

var serviceAccount = require("../config/push_notification_key.json");
const certPath = admin.credential.cert(serviceAccount);
var fcmObj = new fcm(certPath);

function sendPushNotification(req, res, next) {

    try {
        let notificationContent = {
            notification: {
                title: " test notification",
                body: " this is a test notification"
            },
            data: {
                orderID: 324324,
                orderDate: "28 may"
            },
            // We pass the token of the device that we want to send the push notification to
            // you can pass array of tokens if you want to send the notification to more than one device
            token: req.body.fcm_token
        }

        // now send this reponse as a push notification to the client using fcm
        fcmObj.send(notificationContent, function (err, response) {
            if (err) {
                return res.status(500).json({
                    errorMessage: err,
                    statusCode: 500
                });
            }
            else {
                return res.status(200).json({
                    "successMessage": "Push Notification Sent Successfully",
                    "statusCode": 200
                });
            }

        })

    }

    catch (error) {
        console.log("error:" + error);
        res.status(400).json({
            "errorMessage": error,
            "statusCode": 400
        });
    }
}

module.exports = { sendPushNotificationFunc: sendPushNotification };