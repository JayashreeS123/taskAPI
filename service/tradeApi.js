const Request = require("request");
const connectToDatabase = require('../../utils/dbHandler');
const HttpHandler = require('../../utils/HTTPHandler');
const HttpResponse = new HttpHandler();
const TradingSchema = require('../model/tradeModel');



async function createTrade(payload){
    const endpoint = `wss://ws-feed.zebpay.com/marketdata`;
    const headers =  {
        "content-type": "application/json" ,
        "Accept": "application/json" ,
        "Authorization": "here enter authorization key"   
    };

    return new Promise((resolve, reject) => {
        Request({
            method: 'POST',
            url: endpoint,
            headers: headers,
            json: payload
        }, (err, body) => {
            if(err){
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}


module.exports.createTradingData = ( async (event, context) => {
    let data = JSON.parse(event.body);

    try{

        let createdTrade = await createTrade({
            trans_id: data.trans_id,
            fill_qty: data.fill_qty, 
            fill_price: data.fill_price, 
            fill_flags: data.fill_flags,
            inbound_order_filled: data.inbound_order_filled,
            currencyPair: data.currencyPair,
            createdOn: (new Date()),
            lastModifiedDate: (new Date())
        });

        let tradingRecord = dbInsertion(createdTrade);
        return HttpResponse.set(200,{
            tradingRecord : tradingRecord
        });
    }catch (err) {
        return HttpResponse.set(400,err.message);
    }
});


function dbInsertion(payload){
    return new Promise((resolve, reject) => {
        connectToDatabase()
            .then(() => {
                TradingSchema.create(payload)
                    .then(tradingRecord => resolve(tradingRecord))
                    .catch(err => reject(err));
            });
    })
}

module.exports.getTradingData = ( async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;


        let queryObj = {};

        let startingTime, currentTime ;
        if(!!event.queryStringParameters){
           if(!!event.queryStringParameters.hours){

            currentTime = new Date();
            startingTime = currentTime.setHours(currentTime.getHours() - hours)
            queryObj.createdOn = {"$gte" : event.queryStringParameters.startingTime, "$lte" : event.queryStringParameters.currentTime};
           }
        } else {
            return HttpResponse.set(400, 'Bad request ');
        }
        
    try{
        let dbFetchResponse = await fetchTrading(queryObj);

        return HttpResponse.set(200, dbFetchResponse);
    } catch (e) {
        return HttpResponse.set(400, e.message);
    }
});

function fetchTrading(queryObj){
    return new Promise((resolve, reject) => {
        connectToDatabase().then(()=> {
            TradingSchema
                .find(queryObj)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
        })
    });
}


