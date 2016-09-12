"use strict";

var snoowrap = require('snoowrap');
var config = require('./src/config.js');
var DatabaseHandler = require('./src/DatabaseHandler.js');
var RequestHandler = require('./src/RequestHandler.js');
var ResponseTemplate = require('./src/ResponseTemplate.js');
var Utils = require('./src/Utils.js');

// start sqlite
DatabaseHandler.init(config.sqliteDb);

// snoowrap setup
const r = new snoowrap({
    user_agent: config.user_agent,
    client_id: config.client_id,
    client_secret: config.client_secret,
    username: config.username,
    password: config.password
});

// summoner lookup callback function
function summonerApiCallback(body) {
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
        var markupCode = ResponseTemplate(summonerInfo, summonerMastery, topChampions);
        console.log(markupCode);
    }

    // this ID is new, insert into the database
    // DatabaseHandler.insert_response(message.id, markupCode);
};

//*

// mark a array of ids as read
function markRead(ids) {
    var idArray = [];

    // loop through ids
    ids.map((message, index) => {
        // push to array
        idArray.push(message.id);
    });

    // mark all ids as read
    // r.getMessage(idArray).markAsRead();

    console.log('Marked messages as read', idArray);
}

// get all unreadMessages
function checkMessages() {
    // a list with all messages we have read
    var readMessageIds = [];

    // get unread messages
    r.get_unread_messages().then((messages) => {
        if (!messages) {
            console.log('Failed to load messages');
            return;
        }

        console.log('New unread messages: ' + messages.length);

        // loop through messages
        messages.map((message, index) => {
            // add id to list
            readMessageIds.push(message.id);

            // we only check comments
            if (message.was_comment) {
                let messageId = message.id;

                // check if we've already done this ID
                DatabaseHandler.is_checked(messageId, (check_result) => {
                    if (check_result.found === false) {

                        // parse all users from the comment
                        var resultingUsers = Utils.parseBody(message.body);
                        // set the max amount of users
                        resultingUsers = resultingUsers.slice(0, config.user_limit);
                        console.log('Found summoners: ', resultingUsers);

                        // loop through found users
                        for (var userKey in resultingUsers) {
                            RequestHandler.request(
                                config.api_base + '/summoner/' + resultingUsers[userKey]['summoner'] + '/' + resultingUsers[userKey]['server'],
                                summonerApiCallback,
                                (err, body) => {
                                    console.log('error');
                                    console.log(err, body);
                                }
                            );
                        }

                        // this ID is new and has been checked
                        DatabaseHandler.insert_id(check_result.id);
                    } else {
                        console.log('Id Exists: ' + check_result.id);
                    }

                    // mark as read
                    console.log('Mark as read', message.id);
                });
            }
        });

        // mark all messages as read
        markRead(readMessageIds);
    });
}

checkMessages();

/**/