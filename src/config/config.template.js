var config = {};

// save location for sqlite
config.sqliteDb = "./database.db";

// the amount of summoners we can lookup per comment
config.user_limit = 1;
config.champion_highscores_limit = 1;
config.total_highscores_limit = 1;

// check every 'x' ms
config.pollTimer = 10 * 1000;

// api lookup and useragent to use
config.api_base = "https://www.masterypoints.com/api/v1.0";
config.user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36 MasteryPointsBot';

// reddit config
config.username = "mastery_bot"; // reddit username
config.password = "!*x8o&"; // reddit password
config.client_id = "e370ZMUhGZZxoA"; // reddit app client id
config.client_secret = ""; // reddit app secret key

module.exports = config;