const Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;
let isConnected;
let DbHandler = 'mongo url';

module.exports = connectToDatabase = () => {
    if (isConnected) {
        console.log('=> using existing database connection');
        return Promise.resolve();
    }
    console.log('=> using new database connection');
    return Mongoose.connect(DbHandler,{
        useNewUrlParser: true ,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(db => {
            isConnected = db.connections[0].readyState;
        });
};
