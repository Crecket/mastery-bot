"use strict";

var ResponseTemplate = require('./ResponseTemplate.js');
var RequestHandler = require('./RequestHandler.js');
var Utils = require('./Utils.js');
var config = require('./config/config.js');
var chalk = require('chalk');

module.exports = function (r, DatabaseHandler, ExpressSocket, champions, servers) {
    var Logging = require('./Logging.js')(ExpressSocket);

    //*
    var Fetcher = {
        // If champions are updated, update the list
        updateChampions: (newChampions) => {
            champions = newChampions;
        },

        // If servers are updated, update the list
        updateServers: (newServers) => {
            servers = newServers;
        },

        // summoner lookup callback function
        summonerApiCallback: (message, body) => {
            // attempt to parse data
            try {
                var result = JSON.parse(body);
            } catch (err) {
            }

            // get information
            var topChampions = {},
                summonerMastery = false,
                summonerInfo = false;
            if (
                result.summoner_mastery &&
                result.summoner_mastery.mastery_data.length > 0 &&
                result.summoner_info
            ) {
                // store data
                topChampions = result.summoner_mastery.mastery_data.slice(0, 5);
                summonerInfo = result.summoner_info;
                summonerMastery = result.summoner_mastery;

                // create markup template
                var markupCode = ResponseTemplate(summonerInfo, summonerMastery, topChampions, champions);

                // this ID is new, insert into the database
                DatabaseHandler.insert_response(message.id, markupCode);
            }
        },

        // mark a array of messages as read
        markRead: (messages)=> {
            var ids = [];
            messages.map((value) => {
                ids.push(value.id);
            });

            // check if we have atleast 1 message
            if (ids.length > 0) {
                Logging('green', 'Marked messages as read', ids);
                r.markMessagesAsRead(messages).then.catch(err => {
                    Logging('red', 'Failed to mark messages as read');
                    Logging('red', err);
                });
            }
        },

        serverValid: (server) => {
            // check if the server exists in the area
            if (servers[server.toLowerCase()]) {
                return true;
            }
            return false;
        },

        // get all unreadMessages
        checkMessages: () => {
            Logging('cyan', 'Checking messages');

            // get unread messages
            r.getUnreadMessages().then((messages) => {
                if (!messages) {
                    Logging('red', 'Failed to load messages');
                    return;
                }

                Logging('cyan', 'New unread messages: ' + messages.length);

                // loop through messages
                messages.map((message, index) => {

                    // we only check comments
                    if (message.was_comment) {
                        let messageId = message.id;

                        // check if we've already done this ID
                        DatabaseHandler.is_checked(messageId, (check_result) => {
                            if (check_result.found === false) {

                                // parse all users from the comment
                                var resultingUsers = Utils.parseBody(message.body);

                                resultingUsers.map((resultingUser, userIndex) => {
                                    if (!Fetcher.serverValid(resultingUser['server'])) {
                                        // server entered is invalid, remove it from the list
                                        delete resultingUsers[userIndex];
                                    }
                                });

                                // set the max amount of users
                                resultingUsers = resultingUsers.slice(0, config.user_limit);
                                Logging('cyan', 'Found summoners: ');
                                Logging(false, resultingUsers);

                                // loop through found users
                                for (var userKey in resultingUsers) {
                                    var targetUrl = config.api_base + '/summoner/' + encodeURIComponent(resultingUsers[userKey]['summoner']).trim() + '/' + resultingUsers[userKey]['server'] + '?debug=1231423123';
                                    RequestHandler.request(
                                        targetUrl,
                                        (body) => {
                                            Fetcher.summonerApiCallback(message, body);
                                        },
                                        (err, body) => {
                                            Logging('red', 'Error!');
                                            Logging('red', err);
                                        }
                                    );
                                }

                                // this ID is new and has been checked
                                DatabaseHandler.insert_id(check_result.id);
                            } else {
                                Logging('orange', 'Id Exists: ' + check_result.id);
                            }
                        });
                    }
                });

                // mark all messages as read
                Fetcher.markRead(messages);
            }).catch(err => {
                Logging('red', 'Failed to get unread messages');
                Logging('red', err);
            });
        }
    }

    /**/

    return Fetcher;
}