"use strict";

var snoowrap = require('snoowrap');
var config = require('./src/config.js');
var DatabaseHandler = require('./src/DatabaseHandler.js');
var RequestHandler = require('./src/RequestHandler.js');
var ResponseTemplate = require('./src/ResponseTemplate.js');
var Utils = require('./src/Utils.js');

// server list
var servers = true;
var champions = true;

function isReady() {
    if (servers === true) {
        servers = false;
        console.log('Loading servers');
        RequestHandler.request(
            config.api_base + '/static/servers',
            (result) => {
                var serversJson = JSON.parse(result);
                if (serversJson.servers) {
                    servers = serversJson.servers;
                }
                isReady();
            },
            (err, body) => {
                servers = false;
                console.log('error');
                console.log(err, body);
            }
        );
    }
    if (champions === true) {
        champions = false;
        console.log('Loading champions');
        RequestHandler.request(
            config.api_base + '/static/champions',
            (result) => {
                var championsJson = JSON.parse(result);
                if (championsJson.champions) {
                    champions = championsJson.champions;
                }
                isReady();
            },
            (err, body) => {
                champions = false;
                console.log('error');
                console.log(err, body);
            }
        );
    }

    // true means it hasn't been checked
    // false means it failed
    if (champions !== true && champions !== false && servers !== true && servers !== false) {
        // we have all requirements
        checkMessages();
    }
}

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
function summonerApiCallback(message, body) {
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
        console.log(markupCode);
    }

    // this ID is new, insert into the database
    DatabaseHandler.insert_response(message.id, markupCode);
};

//*

// mark a array of messages as read
function markRead(messages) {
    var ids = [];
    messages.map(function (value) {
        ids.push(value.id);
    });

    console.log(messages);

    // mark all ids as read
    // var messages = r.getMessage(ids);
    // var mark = messages.markAsRead();
    // mark.then(function (test) {
    //     console.log(test);
    // });
    //
    // console.log('Marked messages as read', ids);
}

// get all unreadMessages
function checkMessages() {
    console.log('=============================\nCheck messages');

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
            readMessageIds.push(message);

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
                                (body) => {
                                    summonerApiCallback(message, body);
                                },
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

// check if we're ready to go and load requirements
isReady();
setInterval(isReady, 60000);
/**/