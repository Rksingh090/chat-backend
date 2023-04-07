const { Schema, model } = require("mongoose")

const chatSchema = new Schema({
    message: {
        type: String,
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    receiver: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    chat_message_type: {
        type: String,
        default: "normal",
        enum: ["normal", "group", "business", "self"],
    },
    messageType: {
        type: String,
        default: "text",
        enum: ["text", "image", "video", "audio", "file", "location", "contact", "sticker", "document", "gif", "emoji"],
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    audio: {
        type: String,
    },
    file: {
        type: String,
    },
    location: {
        type: String,
    },
    contact: {
        type: String,
    },
    sticker: {
        type: String,
    },
    document: {
        type: String,
    },
    gif: {
        type: String,
    },
    emoji: {
        type: String,
    },
    seen: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true,
});

module.exports = model("Chat", chatSchema);