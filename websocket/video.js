const { sendToWs, buffToJson } = require('../functions');
const handleVideo = (ws, wss) => {
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

        const { type } = data;

        // handle message by switch case
        switch (type) {

            // join user
            case "new-user":
                handleAddUser(ws, data);
                break;
            case "video-call":
                handleCallToUser(ws, wss, data);
                break;
            case "offer":
                handleNewReq(ws, wss, data);
                break;
            case "answer":
                handleAnswer(ws, wss, data);
                break;
            case "send-ice":
                handleSendICE(ws, wss, data);
                break;
            case "nego:offer":
                handleNegotiationOffer(ws, wss, data);
                break;
            case "nego:answer":
                handleNegotiationAnswer(ws, wss, data);
                break;

        }

    });

}

function handleAddUser(ws, data) {
    console.log(`New user joined ${data._id}`)
    ws.id = data._id
}

function handleCallToUser(ws, wss, data) {
    wss.clients.forEach((client) => {
        if (client.id === data.to) {
            client.send(JSON.stringify({
                type: "call",
                from: data.from,
                to: data.to
            }))
        }
    })
}

// offer 
function handleNewReq(ws, wss, data) {
    console.log("Offer to ", data.to);
    wss.clients.forEach((client) => {
        if (client.id === data.to) {
            client.send(JSON.stringify({
                type: "offer",
                sdp: data.sdp,
                from: data.from,
                to: data.to
            }))
        }
    })
}

// answer 
function handleAnswer(ws, wss, data) {
    console.log("Answer to", data.to);

    wss.clients.forEach((client) => {
        if (client.id === data.to) {
            client.send(JSON.stringify({
                type: "answer",
                sdp: data.sdp,
                from: data.from,
                to: data.to
            }))
        }
    })
}

// handle ice candidates
function handleSendICE(ws, wss, data) {
   
    wss.clients.forEach((client) => {
        if (client.id === data.to) {
            client.send(JSON.stringify({
                type: "get-ice",
                candidate: data.candidate,
            }))
        }
    })

}
function handleNegotiationOffer(ws, wss, data) {
    const { sdp, to } = data;
    console.log("Nego offer to", to)
    wss.clients.forEach((client) => {
        if (client.id === to) {
            client.send(JSON.stringify({
                type: "nego:offer",
                sdp: sdp
            }))
        }
    })

}
function handleNegotiationAnswer(ws, wss, data) {
    const { sdp, to } = data;
    console.log("Nego answer to", to)
    wss.clients.forEach((client) => {
        if (client.id === to) {
            client.send(JSON.stringify({
                type: "nego:answer",
                sdp: sdp
            }))
        }
    })

}
module.exports = { handleVideo }
