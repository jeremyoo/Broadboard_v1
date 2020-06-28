const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
    },
});

module.exports = mongoose.model("Comment", commentSchema);