"use strict";

var RequestHandler = require('./RequestHandler.js');
var Utils = require('./Utils.js');
var config = require('./config/config.js');

module.exports = function (r, DatabaseHandler, ExpressSocket) {
    var Logging = require('./Logging')(ExpressSocket);

    var Responder = {
        getResponses: () => {
            Logging('bgCyan', 'Checking response messages');

            DatabaseHandler.get_responses((result)=> {
                var queueActive = true;
                if (!result) {
                    Logging('red', 'Failed to load response messages');
                    return;
                }

                Logging('cyan', 'New response messages: ' + result.length);


                // loop through responses
                result.map((value, key)=> {
                    if (!queueActive) {
                        // queue was stopped, just return null
                        return;
                    }

                    // create new comment object
                    var comment = r.getComment(value.id);

                    // fetch comment and see it if is valid/not removed
                    comment.fetch()
                        .then(comment => {
                            // comment is valid, reply to the comment
                            comment.reply(value.markup).then(success => {
                                // comment may not exist or some other error was thrown
                                Logging('green', 'Replied to ' + value.id);
                                DatabaseHandler.set_response_sent(value.id);
                            }).catch(err => {
                                // comment may not exist or some other error was thrown
                                Logging('red', 'Failed to reply to comment ID: ' + value.id);

                                // check the error type
                                let type = err.message.split(",");
                                if (type[0] === "RATELIMIT") {
                                    Logging('red', 'Stopping current queue, ratelimit reached');
                                    // stop any further attempts, we reached our limit
                                    queueActive = false;
                                }
                            });
                        })
                        .catch(err => {
                            // comment may not exist or some other error was thrown
                            Logging('red', 'Failed to fetch comment ID: ' + value.id);
                            Logging('red', err);
                        });
                });

            });
        },

    };

    return Responder;
}
