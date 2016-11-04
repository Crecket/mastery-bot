"use strict";

// npm modules
const snoowrap = require('snoowrap');

// custom modules
const config = require('./src/config/config.js');

// command line arguments
const commandLineArgs = require('command-line-args');

// parse the arguments
const options = commandLineArgs([
    {
        name: 'gui',
        alias: 'g',
        type: Boolean,
        defaultValue: false
    },
]);

// holds some stats for the server
var genericInfo = {
        // timer duration for the polling
        nextTimer: 0,

        // most recent username and server
        recentUser: 'none',

        // amount of times we request unread messages and how many we received
        timesPolled: 0,
        timesReceived: 0,
        // amount of users we parsed from messages
        foundUsers: 0,
        // reply count
        sentResponses: 0,

        // list of errors
        errorList: [],
        // list of generic messages
        messageList: [],
    },
    // server list storage, is fetched from api
    servers = false,
    // champion list storage, is fetched from api
    champions = false;

// helpers and classes
var RequestHandler = require('./src/RequestHandler.js');
var DatabaseHandler = require('./src/DatabaseHandler.js')();
var ConsoleTemplate = require('./src/ConsoleTemplate');
var Logging = require('./src/Logging')();

// start sqlite
DatabaseHandler.init(config.sqliteDb);

// snoowrap setup for reddit api calls
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
var Responder = require('./src/Responder')(r, DatabaseHandler, {
    sentResponse: () => {
        genericInfo.sentResponses += 1;
    },
});
var Fetcher = require('./src/Fetcher')(r, DatabaseHandler, {servers: servers, champions: champions}, {
    hasPolled: () => {
        genericInfo.timesPolled += 1;
    },
    hasReceived: () => {
        genericInfo.timesReceived += 1;
    },
    hasFound: (username) => {
        genericInfo.foundUsers += 1;
        genericInfo.recentUser = username;
    },
});

var loadChampions = new Promise((resolve, reject)=> {
    if (!champions) {
        Logging('cyan', 'Loading champions');
        RequestHandler.request(
            config.api_base + '/static/champions',
            (result) => {
                var championsJson = JSON.parse(result);
                if (championsJson.champions) {
                    champions = championsJson.champions;
                }

                // reformat champions
                for (var key in champions) {
                    champions[champions[key]['champkey']] = champions[key];
                    champions[champions[key]['pretty_name']] = champions[key];
                }

                Fetcher.updateChampions(champions);
                resolve();
            },
            (err) => {
                champions = false;
                Logging('red', 'Error!');
                Logging('red', err);
                reject();
            }
        );
    } else {
        resolve();
    }
});

var loadServers = new Promise((resolve, reject)=> {
    if (!servers) {
        Logging('cyan', 'Loading servers');
        RequestHandler.request(
            config.api_base + '/static/servers',
            (result) => {
                var serversJson = JSON.parse(result);
                if (serversJson.servers) {
                    servers = serversJson.servers;
                }
                Fetcher.updateServers(servers);
                resolve();
            },
            (err) => {
                servers = false;
                Logging('red', 'Error!');
                Logging('red', err);
                reject();
            }
        );
    } else {
        resolve();
    }
});

// check if we have the servers and champions
function runFetcher() {
    Promise.all([loadChampions, loadServers]).then((result) => {
        Fetcher.checkMessages();
    });
}

// 1 second timer to keep track of the main timer progress. used in the gui
setInterval(() => {
    genericInfo.nextTimer = genericInfo.nextTimer + 1000;
}, 1000);

// if the gui parameter is given ,start showing the gui
if (options.gui) {
    // refresh the guid for the console
    const showGui = () => {
        ConsoleTemplate(genericInfo, config);
    };
    // Show the console gui
    showGui();
    setInterval(showGui, 1000);
}

// run the initial round
runFetcher();
Responder.getResponses();

// main timer
setInterval(()=> {
    runFetcher();
    Responder.getResponses();
    genericInfo.nextTimer = 0;
}, config.pollTimer);