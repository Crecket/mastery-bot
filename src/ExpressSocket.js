var express = require('express');
var https = require('https');
var chalk = require('chalk');
var path = require('path');

module.exports = function (config) {

    // new express app
    var app = express();

    // create a https server
    var server = https.Server(config.sslOptions, app);

    // bind socket io to server
    var io = require('socket.io').listen(server);

    // static files
    app.use(express.static('public'));

    app.get('/', function (req, res) {
        // res.sendFile(__dirname + '/../public/index.html');
        res.sendFile(path.resolve(__dirname + '/../public/index.html'));
    });

    // sockets
    io.on('connection', function (socket) {
        io.emit('system success', 'Connected');
    });

    // start listening
    server.listen(config.port, function () {
        console.log(chalk.bgBlue('Http and sockets listening on *:' + config.port));
    });

    return {
        io: io,
        success: (data)=> {
            io.emit('system success', data);
        },
        error: (data)=> {
            io.emit('system error', data);
        },
        debug: (data)=> {
            io.emit('system debug', data);
        },
    };
};