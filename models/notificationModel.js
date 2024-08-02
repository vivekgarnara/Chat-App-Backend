const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    notiMessage: {
        type: String,
        required: true,
    },
    isSeen: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);