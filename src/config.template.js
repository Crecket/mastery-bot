var config = {};

// save location for sqlite
config.sqliteDb = "./database.db";

// the amount of users we can lookup per comment
config.user_limit = 1;

// api lookup and useragent to use
config.api_base = "https://www.masterypoints.com/api/v1.0";
config.user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36 MasteryPointsBot';

// reddit config
config.username = "";
config.password = "";
config.client_id = "";
config.client_secret = "";

module.exports = config;