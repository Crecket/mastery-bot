"use strict";

const snoowrap = require('snoowrap');

class MasteryBot {

    /**
     * @param options - options given through command line
     * @param config - config which is static and taken from the config file
     */
    constructor(options, config) {
        this._options = options;
        this._config = config;

        // new snoowrap object to do reddit actions
        this._r = new snoowrap({
            user_agent: this._config.user_agent,
            client_id: this._config.client_id,
            client_secret: this._config.client_secret,
            username: this._config.username,
            password: this._config.password,

            // don't continue api queue if rate limit reached
            continueAfterRatelimitError: false
        });
    }

    start() {

    }
}

exports.default = MasteryBot;