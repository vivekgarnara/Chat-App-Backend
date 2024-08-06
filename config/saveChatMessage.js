const Message = require('../models/messageModel');

const saveChatMessage = async(data) => {
    const sender = data.senderId;
    const receiver = data.receiverId;
    const message = data.messageToSend;

    const newMessage = await Message.create({sender, receiver, message});
}

module.exports = saveChatMessage;

