"use strict";

var chalk = require('chalk');
var snoowrap = require('snoowrap');

var config = require('./src/config/config.js');
var RequestHandler = require('./src/RequestHandler.js');
var ExpressSocket = require('./src/ExpressSocket.js')(config.port);
var DatabaseHandler = require('./src/DatabaseHandler.js')();
var Logging = require('./src/Logging')();
var Utils = require('./src/Utils.js');

var genericInfo = {
    // most recent username and server
    recentUser: false,

    // amount of times we request unread messages and how many we received
    unreadMessagesChecked: 0,
    unreadMessagesReceived: 0,

    // amount of users we parsed from messages
    foundUsers: 0,

    // reply count
    sentResponses: 0
};

// server list
var servers = true;
var champions = true;

// start sqlite
DatabaseHandler.init(config.sqliteDb);

// snoowrap setup
const r = new snoowrap({
    user_agent: config.user_agent,
    client_id: config.client_id,
    client_secret: config.client_secret,
    username: config.username,
    password: config.password,

    // don't continue api queue if rate limit reached
    continueAfterRatelimitError: false
});

// helper objects
var Responder = require('./src/Responder')(r, DatabaseHandler, (amount) => {
    // sent a response succesfuly
    genericInfo.sentResponses += amount;
});
var Fetcher = require('./src/Fetcher')(r, DatabaseHandler, {servers: servers, champions: champions});

// check if we have the servers and champions
function isReady() {
    if (servers === true) {
        servers = false;
        Logging('cyan', 'Loading servers\n');
        RequestHandler.request(
            config.api_base + '/static/servers',
            (result) => {
                var serversJson = JSON.parse(result);
                if (serversJson.servers) {
                    servers = serversJson.servers;
                }
                Fetcher.updateServers(servers);
                isReady();
            },
            (err) => {
                servers = false;
                Logging('red', 'Error!');
                Logging('red', err);
            }
        );
    }
    if (champions === true) {
        champions = false;
        Logging('cyan', 'Loading champions\n');
        RequestHandler.request(
            config.api_base + '/static/champions',
            (result) => {
                var championsJson = JSON.parse(result);
                if (championsJson.champions) {
                    champions = championsJson.champions;
                }
                Fetcher.updateChampions(champions);
                isReady();
            },
            (err) => {
                champions = false;
                Logging('red', 'Error!');
                Logging('red', err);
            }
        );
    }

    // champions|server have to be a object
    // databaseready has to be true
    if (champions !== true && champions !== false && servers !== true && servers !== false) {
        // we have all requirements, run anything that needs the champions or server list
        Fetcher.checkMessages();
    }
}

setTimeout(()=> {
    // wait a bit for everything to be online
    isReady();
    // Responder.getResponses();
}, 500);

// timer
setInterval(()=> {
    isReady();
    // Responder.getResponses();
}, 4 * 1000);



