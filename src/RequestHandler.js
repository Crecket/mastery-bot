var request = require('request');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = {
    request: function (url, callback, callbackErr, data) {
        if (!data) {
            data = {};
        }
        request.post(
            {
                url: url,
                form: data
            },
            (err, httpResponse, body) => {
                if (err) {
                    callbackErr(err, body);
                    return;
                }

                callback(body);
            }
        );
    }
};