"use strict";

// npm modules
var snoowrap = require('snoowrap');

// custom modules
var config = require('./src/config/config.js');

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
    servers = true,
    // champion list storage, is fetched from api
    champions = true;

// add a error to the error list in the gui
const gotError = (err) => {
    genericInfo.errorList.push(err);
};

// add a error to the error list in the gui
const gotMessage = (err) => {
    genericInfo.messageList.push(err);
};

// helpers and classes
var RequestHandler = require('./src/RequestHandler.js');
var ExpressSocket = require('./src/ExpressSocket.js')(config.port);
var DatabaseHandler = require('./src/DatabaseHandler.js')({gotError: gotError});
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
var Responder = require('./src/Responder')(r, DatabaseHandler,
    {
        gotError: gotError,
        gotMessage: gotMessage,
        sentResponse: () => {
            genericInfo.sentResponses += 1;
        },
    });
var Fetcher = require('./src/Fetcher')(r, DatabaseHandler, {servers: servers, champions: champions},
    {
        gotError: gotError,
        gotMessage: gotMessage,
        hasPolled: () => {
            genericInfo.timesPolled += 1;
        },
        hasReceived: () => {
            genericInfo.timesReceived += 1;
        },
        hasFound: (username) => {
            genericInfo.recentUser = username;
        },
    }
);

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
        Logging('cyan', 'Loading champions');
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

// main poll start function
function start() {
    setTimeout(()=> {
        // wait a bit for everything to be online
        isReady();
        Responder.getResponses();
    }, 500);

    // timer
    setInterval(()=> {
        isReady();
        Responder.getResponses();
        genericInfo.nextTimer = 0;
    }, config.pollTimer);
}

// 1 second timer to keep track of the main timer progress. used in the gui
setInterval(() => {
    // minus 1 every second to keep track of the timer
    genericInfo.nextTimer = genericInfo.nextTimer + 1000;
}, 1000);

// refresh the guid for the console
const showGui = () => {
    ConsoleTemplate(genericInfo, config);
};

// Show the console gui
showGui();
setInterval(showGui, 1000);

// start polling
start();
