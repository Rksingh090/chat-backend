const User = require('./models/user_schema');

// buffer to json 
const buffToJson = (data) => {
    try {
        let jsondata = JSON.parse(Buffer.from(data, 'base64').toString('utf8'))
        return jsondata;
    } catch (error) {
        return {
            error: true,
            message: "Invalid JSON"
        };
    }
    
};

// buffer to json 
const buffToString = (data) => Buffer.from(data, 'base64').toString('utf8');

// json to string
const stringify = (data) => Buffer.from(JSON.stringify(data)).toString('utf8');

// message send to server
const sendToWs = (ws, data) => {
    ws.send(stringify(data));
}

// get auth user by token 

const getUser = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    const userdata = await User.findById(id);
    return userdata;
}


module.exports = {
    buffToJson,
    buffToString,
    stringify,
    sendToWs
}