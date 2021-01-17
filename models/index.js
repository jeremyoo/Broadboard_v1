const mongoose = require('mongoose');
// environment variables
const { MONGO_DB, MONGO_PASSWORD, NODE_ENV } = process.env;

// MongoDB URL
const MONGO_URL = `mongodb+srv://devsprout:${MONGO_PASSWORD}@cluster0.mfgcq.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

module.exports = () => {
    const connect = () => {
        // Mongoose query occur on terminal when not 'production'
        if (NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        // Mongoose connect to MongoDB URL
        mongoose.connect(MONGO_URL, {
            dbName: 'bboard',
        },  (error) => {
            if (error) {
                console.log('MongoDB connection error occured', error)
            } else {
                console.log('MongoDB connected successfully')
            };
        });
    };
    connect();
    // when Mongoose connection error occured
    mongoose.connection.on('error', (error) => {
        console.log('MongoDB connection error occured', error);
    })
    // when Monngose connection disconnected
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected, trying to reconnect to MongoDB..');
        connect();
    });
    
    // calling schemas
    require('./user');
    require('./board');
    require('./comment');
    require('./counter');
};