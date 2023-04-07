const { sendToWs } = require("../functions");

const rooms = {};

// create room 
const createRoom = (ws, data) => {
    const { roomId, _id } = data;

    if (!roomId) {
        return sendToWs(ws, {
            error: true,
            message: "Please provide room name"
        });
    }
    if (rooms[roomId]) {
        return sendToWs(ws, {
            error: true,
            message: "Room already exists"
        });
    }
    rooms[roomId] = {
        name: roomId,
        users: [ws.id],
        owner: _id,
        clients: [ws]
    }
    console.log(rooms);

    sendToWs(ws, {
        message: "Room created"
    });
}

const joinRoom = (ws, data) => {
    const { roomId } = data;
    if (!roomId) {
        return sendToWs(ws, {
            error: true,
            message: "Please provide room name"
        });
    }
    if (!rooms[roomId]) {
        return sendToWs(ws, {
            error: true,
            message: "Room does not exists"
        });
    }

    rooms[roomId].users.push(ws.id);
    rooms[roomId].clients.push(ws);
    
    console.log(rooms);

    sendToWs(ws, {
        message: "User joined room"
    });
}

const sendToRoom = (ws, data, wss) => {
    const { roomId, message } = data;
    if (!roomId) {
        return sendToWs(ws, {
            error: true,
            message: "Please provide room name"
        });
    }
    if (!message) {
        return sendToWs(ws, {
            error: true,
            message: "Please provide message"
        });
    }
    if (!rooms[roomId]) {
        return sendToWs(ws, {
            error: true,
            message: "Room does not exists"
        });
    }

    const yourRoom = rooms[roomId];
    yourRoom.clients.forEach(client => {
        sendToWs(client, {
            message: message,
            sender: ws.id
        });
    });


    // wss.clients.forEach(client => {
    //     if (client.room === room) {
    //         sendToWs(client, {
    //             message: message
    //         });
    //     }
    // });
}

module.exports = {
    createRoom,
    joinRoom,
    sendToRoom
}
