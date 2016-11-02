var config = {};
var os = require('os');
var fs = require('fs');

// save location for sqlite
config.sqliteDb = "./database.db";

// the amount of users we can lookup per comment
config.user_limit = 1;

// http/socket port
config.port = 13337;

// check every 'x' ms
config.pollTimer = 30 * 1000;

// api lookup and useragent to use
config.api_base = "https://www.masterypoints.com/api/v1.0";
config.user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36 MasteryPointsBot';

// reddit config
config.username = "mastery_bot";
config.password = "!IGmMy18vaYUw$@*x8o&";
config.client_id = "e370ZMUhGZZxoA";
config.client_secret = "";

module.exports = config;