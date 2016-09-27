var config = {};
var os = require('os');
var fs = require('fs');

// save location for sqlite
config.sqliteDb = "./database.db";

// the amount of users we can lookup per comment
config.user_limit = 1;

// http/socket port
config.port = 8080;

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

// online hostname, if i doesn't match use local settings
config.offlineHostName = "Gregmain-PC";

// check if online host name is found
if (os.hostname().trim() === config.offlineHostName || os.hostname().trim() === 'Greg-PC') {
    config.sslOptions = {
        key: fs.readFileSync('src/certs/localhost.key'),
        cert: fs.readFileSync('src/certs/localhost.crt'),
        ca: [fs.readFileSync('src/certs/localhostCA.pem')],
        ciphers: ["ECDHE-RSA-AES256-SHA384", "DHE-RSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA256", "DHE-RSA-AES256-SHA256", "ECDHE-RSA-AES128-SHA256", "DHE-RSA-AES128-SHA256", "HIGH", "!aNULL", "!eNULL", "!EXPORT", "!DES", "!RC4", "!MD5", "!PSK", "!SRP", "!CAMELLIA"].join(':'),
        honorCipherOrder: true,
        requestCert: false
    };
} else {
    config.sslOptions = {
        key: fs.readFileSync('/home/crecket/server.key'),
        cert: fs.readFileSync('/home/crecket/masterypoints_com.crt'),
        // ca is required in most cases or some devices will decline the ssl certificate
        ca: [fs.readFileSync('/home/crecket/bundle.crt')],
        ciphers: ["ECDHE-RSA-AES256-SHA384", "DHE-RSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA256", "DHE-RSA-AES256-SHA256", "ECDHE-RSA-AES128-SHA256", "DHE-RSA-AES128-SHA256", "HIGH", "!aNULL", "!eNULL", "!EXPORT", "!DES", "!RC4", "!MD5", "!PSK", "!SRP", "!CAMELLIA"].join(':'),
        honorCipherOrder: true,
        requestCert: false
    };
}

module.exports = config;