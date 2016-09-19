var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chalk = require('chalk');
var path = require('path');

module.exports = function (port) {

    // static files
    app.use(express.static('public'));

    app.get('/', function (req, res) {
        // res.sendFile(__dirname + '/../public/index.html');
        res.sendFile(path.resolve(__dirname + '/../public/index.html'));
    });

    io.on('connection', function (socket) {
        socket.on('chat message', function (msg) {
            io.emit('chat message', msg);
        });
    });

    http.listen(port, function () {
        console.log(chalk.bgBlue('Http and sockets listening on *:' + port));
    });

    return io;
};