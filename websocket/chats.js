const { sendToWs, buffToJson } = require('../functions');
const { createRoom, joinRoom, sendToRoom } = require('./room');
const { joinUser, sendToUser } = require("./user");

const handleChat = (ws, wss) => {
    console.log("New Chat connection");

    ws.on('message', (message) => {
        // data to json 
        const data = buffToJson(message);

        // if error throw invalid json
        if (data.error) {
            return sendToWs(ws, {
                error: true,
                message: "Invalid JSON"
            });
        }

        // message type 
        const { type } = data;

        // handle message by switch case
        switch (type) {

            // join user
            case "join":
                console.log("new user "+data._id+" joined");
                joinUser(ws, data);
                break;

            // send to user
            case "send-to-user":
                console.log("Sneding message to "+ data._id + " from "+ ws.id);
                sendToUser(ws, data, wss);
                break;

            // create room
            case "create-room":
                createRoom(ws, data, wss);
                break;

            // join room
            case "join-room":
                joinRoom(ws, data);
                break;

            // send to room
            case "send-to-room":
                sendToRoom(ws, data, wss);
                break;

            default:
                break;
        }
    });
}


module.exports = {
    handleChat
}