"use strict";

var RequestHandler = require('./RequestHandler.js');
var Utils = require('./Utils.js');
var chalk = require('chalk');
var config = require('./config/config.js');

module.exports = function (r, DatabaseHandler, ExpressSocket) {
    var Logging = require('./Logging')(ExpressSocket);

    var Responder = {};

    return Responder;
}
