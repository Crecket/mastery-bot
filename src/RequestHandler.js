var request = require('request');

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