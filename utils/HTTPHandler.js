class HTTPResponseHandler{
    constructor(){
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        };
    }
    set(httpStatusCode, responseBody, event=null, headers = {}){
        let user = null;
       
        return {
            statusCode: httpStatusCode || 404,
            headers: Object.assign(this.defaultHeaders, headers),
            body: JSON.stringify({
                success : (Number(httpStatusCode) - Number(httpStatusCode)%100) / 100 === 2,
                message : responseBody,
                user : user
            })
        }
    }
}

module.exports = HTTPResponseHandler;
