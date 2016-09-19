"use strict";

var RequestHandler = require('./RequestHandler.js');
var config = require('./config/config.js');

module.exports = function (r, DatabaseHandler, callbacks) {
    var Logging = require('./Logging')();

    var Responder = {
        queue: [],
        queueActive: true,
        firstItem: true,
        next: () => {
            if (Responder.queue.length > 0) {
                if (Responder.firstItem) {
                    // this is no longer the first item
                    Responder.firstItem = false;
                }else{
                    // delete last item
                    Responder.queue.pop();
                }
                // get the last item in the liast
                var response = Responder.queue[0];

                // attempt to send new response with last item
                Responder.respond(response);
            }
        },
        finish: () => {
            // reset queue
            Responder.queueActive = true;
            Responder.firstItem = true;
            Responder.queue = [];
        },
        respond: (response) => {
            if (!Responder.queueActive) {
                // reset queue
                Responder.finish();
                // queue was stopped, just return null
                return;
            }

            // create new comment object
            var comment = r.getComment(response.id);

            // fetch comment and see it if is valid/not removed
            comment.fetch()
                .then(comment => {
                    // comment is valid, reply to the comment
                    comment.reply(response.markup).then(success => {
                        // comment may not exist or some other error was thrown
                        Logging('green', 'Replied to ' + response.id);
                        DatabaseHandler.set_response_sent(response.id);

                        // add sent response callback count
                        callbacks.sentResponses();

                        // next item
                        Responder.next();
                    }).catch(err => {
                        callbacks.gotError({err: err});

                        // comment may not exist or some other error was thrown
                        Logging('red', 'Failed to reply to comment ID: ' + response.id);

                        // check the error type
                        let type = err.message.split(",");
                        if (type[0] === "RATELIMIT") {
                            Logging('red', 'Stopping current queue, ratelimit reached');
                            // stop any further attempts, we reached our limit or something went wrongs
                            Responder.finish();

                        } else if (type[0] === "DELETED_COMMENT") {
                            Logging('red', 'Comment was deleted.');
                            // set sent, we cant respond
                            DatabaseHandler.set_response_sent(response.id);
                            // stop any further attempts, we reached our limit or something went wrongs
                            Responder.next();
                        }
                    });
                })
                .catch(err => {
                    callbacks.gotError(err);

                    // comment may not exist or some other error was thrown
                    Logging('red', 'Failed to fetch comment ID: ' + value.id);
                    Logging('red', err);
                });
        },
        getResponses: () => {
            // Logging('bgCyan', 'Checking response messages');

            DatabaseHandler.get_responses((result)=> {
                Responder.queueActive = true;
                if (!result) {
                    Logging('red', 'Failed to load response messages');
                    return;
                }

                // store the queue
                Responder.queue = result;
                Responder.queueActive = true;

                // next item
                Responder.next();
            });
        },

    };

    return Responder;
}
