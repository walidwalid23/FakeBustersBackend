const express = require('express');
const notificationsRouter = express.Router();
const verifyUserTokenMiddleware = require('../logic/middlewares');
const { getUserNotificationsFunc } = require('../logic/notifications_logic');
const { deleteNotificationFunc } = require('../logic/notifications_logic');


notificationsRouter.get('/getNotifications', verifyUserTokenMiddleware, getUserNotificationsFunc);
notificationsRouter.post('/deleteNotification', verifyUserTokenMiddleware, deleteNotificationFunc);

module.exports = notificationsRouter;