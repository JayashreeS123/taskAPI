const Mongoose = require('mongoose');

const TradingSchema = new Mongoose.Schema({
    trans_id: {
        type: Number,
        required: true
    },
    fill_qty: {
        type: Number,
        required: true
    },
    fill_price: {
        type: Number,
        required: true
    },
    fill_flags: {
        type: Number,
        required : true
    },
    inbound_order_filled: {
        type: Boolean,
        required: true
    },
    currencyPair: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    },
    lastModifiedDate: {
        type: Date,
        required: true
    }
});


let model;
try {
    model = Mongoose.model('TradingRecord');
} catch (error) {
    model = Mongoose.model('TradingRecord', TradingSchema);
}

module.exports = model;
