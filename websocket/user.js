const { sendToWs } = require("../functions");


// join user 
const joinUser = (ws, data) => {
    const { _id } = data;
    if (!_id) {
        return sendToWs(ws, {
            error: true,
            message: "Please provide user id"
        });
    }
    ws.id = _id;
    sendToWs(ws, {
        message: "User joined"
    });
}

// send message to specific user 
const sendToUser = (ws, data, wss) => {
    const { _id, message } = data;
    if (!_id) {
        return sendToWs(ws, {
            error: true,
            message: "Please provide user id"
        });
    }
    if (!message) {
        return sendToWs(ws, {
            error: true,
            message: "Please provide message"
        });
    }


    wss.clients.forEach(client => {
        if (client.id === _id) {
            sendToWs(client, {
                message: message
            });
        }
    });
}


module.exports = {
    joinUser,
    sendToUser
}
