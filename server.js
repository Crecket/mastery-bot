"use strict";

var chalk = require('chalk');
var snoowrap = require('snoowrap');

var config = require('./src/config/config.js');

var RequestHandler = require('./src/RequestHandler.js');
// var  = require('./src/.js')(config.port);
var DatabaseHandler = require('./src/DatabaseHandler.js')();
var Logging = require('./src/Logging')();
var Utils = require('./src/Utils.js');

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
    password: config.password
});

// helper objects
var Responder = require('./src/Responder')(r, DatabaseHandler );
var Fetcher = require('./src/Fetcher')(r, DatabaseHandler, champions, servers);

// check if we have the servers and champions
function isReady() {
    if (servers === true) {
        servers = false;
        Logging('cyan', 'Loading servers');
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
        Logging('cyan','Loading champions');
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

    // true means it hasn't been checked
    // false means it failed
    if (champions !== true && champions !== false && servers !== true && servers !== false) {
        // we have all requirements
        Fetcher.checkMessages();
    }
}

// check if we're ready to go and load requirements
isReady();
setInterval(isReady, 30 * 1000 * 1);
