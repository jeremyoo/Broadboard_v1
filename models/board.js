const mongoose = require('mongoose');
const Counter = require('./counter');
const { Schema } = mongoose;


const boardSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    writing: {
        type: String,
        required: true,
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: {
            type: String,
            required: true,
        },
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
    views: {
        type: Number,
        default: 0,
    },
    numId: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
    },
});

boardSchema.pre('save', async function (next) {
    const board = this;
    if (board.isNew){
        counter = await Counter.findOne({ name: 'boards' }).exec();
        if (!counter) counter = await Counter.create({ name: 'boards' });
        counter.count++;
        counter.save();
        board.numId = counter.count;
    }
    return next();
});


module.exports = mongoose.model('Board', boardSchema);


