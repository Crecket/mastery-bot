"use strict";

var ChampionHighscoresResponseTemplate = require('./ResponseTemplates/ChampionHighscores');
var TotalHighscoresResponseTemplate = require('./ResponseTemplates/TotalHighscores');
var SummonerResponseTemplate = require('./ResponseTemplates/Summoner');
var RequestHandler = require('./RequestHandler.js');
var Parser = require('./Parser.js');
var config = require('./config/config.js');
var chalk = require('chalk');

module.exports = function (r, DatabaseHandler, staticData, callbacks) {
    var Logging = require('./Logging.js')();
    var champions = staticData.champions;
    var servers = staticData.servers;

    //*
    var Fetcher = {
        // If champions are updated, update the list
        updateChampions: (newChampions) => {
            champions = newChampions;
        },

        // If servers are updated, update the list
        updateServers: (newServers) => {
            servers = newServers;
        },

        parserCallback: (message, resultingData) => {

            // summoners have highest priority
            if (resultingData.summoners.length > 0) {
                var resultingUsers = resultingData.summoners;

                resultingUsers.map((resultingUser, userIndex) => {
                    if (!Fetcher.serverValid(resultingUser['server'])) {
                        // server entered is invalid, remove it from the list
                        delete resultingUsers[userIndex];
                    } else {
                        // set most recent username
                        callbacks.hasFound(resultingUser.summoner);
                    }
                });

                // set the max amount of users
                resultingUsers = resultingUsers.slice(0, config.user_limit);
                Logging('cyan', 'Found summoners: ');
                Logging(false, resultingUsers);

                // loop through found users
                for (var userKey in resultingUsers) {
                    var targetUrl = config.api_base + '/summoner/' + encodeURIComponent(resultingUsers[userKey]['summoner']).trim() +
                        '/' + resultingUsers[userKey]['server'];
                    RequestHandler.request(
                        targetUrl,
                        (body) => {
                            Fetcher.summonerApiCallback(message, body);
                        },
                        (err, body) => {
                            Logging('red', 'Error!');
                            Logging('red', err);
                        }
                    );
                }

            } else if (resultingData.champion_highscores.length > 0) {
                var champion_highscores = resultingData.champion_highscores;

                champion_highscores.map((resultingUser, userIndex) => {
                    if (!Fetcher.serverValid(resultingUser['server'])) {
                        // server entered is invalid, remove it from the list
                        delete champion_highscores[userIndex];
                    } else if (!Fetcher.championValid(resultingUser['champion'])) {
                        // champion entered is invalid, remove it from the list
                        delete champion_highscores[userIndex];
                    }
                });

                // set the max amount of highscores to lookup
                champion_highscores = champion_highscores.slice(0, config.champion_highscores_limit);
                Logging('cyan', 'Found champion highscores: ');
                Logging(false, champion_highscores);

                // loop through found users
                for (var championKey in champion_highscores) {
                    var targetUrl = config.api_base + '/highscores/champion' +
                        '/' + champions[champion_highscores[championKey]['champion']]['id'] +
                        '/0/20/' + champion_highscores[championKey]['server'];

                    RequestHandler.request(
                        targetUrl,
                        (body) => {
                            Fetcher.championApiCallback(message, body);
                        },
                        (err, body) => {
                            Logging('red', 'Error!');
                            Logging('red', err);
                        }
                    );
                }

            } else if (resultingData.champion_highscores.length > 0) {
                var champion_highscores = resultingData.champion_highscores;

                champion_highscores.map((resultingUser, userIndex) => {
                    if (!Fetcher.serverValid(resultingUser['server'])) {
                        // server entered is invalid, remove it from the list
                        delete champion_highscores[userIndex];
                    } else if (!Fetcher.championValid(resultingUser['champion'])) {
                        // champion entered is invalid, remove it from the list
                        delete champion_highscores[userIndex];
                    }
                });

                // set the max amount of highscores to lookup
                champion_highscores = champion_highscores.slice(0, config.champion_highscores_limit);
                Logging('cyan', 'Found champion highscores: ');
                Logging(false, champion_highscores);

                // loop through found users
                for (var championKey in champion_highscores) {
                    var targetUrl = config.api_base + '/champion' +
                        '/' + champion_highscores[championKey]['id'] +
                        '/0/20/' + champion_highscores[championKey]['server'];
                    RequestHandler.request(
                        targetUrl,
                        (body) => {
                            Fetcher.championApiCallback(message, body);
                        },
                        (err, body) => {
                            Logging('red', 'Error!');
                            Logging('red', err);
                        }
                    );
                }

            }
        },

        // total points highscores api lookup callback
        totalApiCallback: (message, body) => {
            // attempt to parse data
            var result = false;
            try {
                result = JSON.parse(body);
            } catch (err) {
            }

            // get information
            var topChampions = {},
                summonerMastery = false,
                summonerInfo = false;
            if (
                result &&
                result.summoner_mastery &&
                result.summoner_mastery.mastery_data.length > 0 &&
                result.summoner_info
            ) {
                // store data
                topChampions = result.summoner_mastery.mastery_data.slice(0, 5);
                summonerInfo = result.summoner_info;
                summonerMastery = result.summoner_mastery;

                // create markup template
                var markupCode = ChampionHighscoresResponseTemplate(summonerInfo, summonerMastery, topChampions, champions);

                // this ID is new, insert into the database
                DatabaseHandler.insert_response(message.id, markupCode);
            }
        },

        // champion highscores api lookup callback
        championApiCallback: (message, body) => {
            // attempt to parse data
            var result = false;
            try {
                result = JSON.parse(body);
            } catch (err) {
            }

            if (result) {
                // create markup template
                var markupCode = ChampionHighscoresResponseTemplate(result.highscores, champions);

                // this ID is new, insert into the database
                DatabaseHandler.insert_response(message.id, markupCode);
            }
        },

        // summoner lookup callback function
        summonerApiCallback: (message, body) => {
            // attempt to parse data
            var result = false;
            try {
                result = JSON.parse(body);
            } catch (err) {
            }

            // get information
            var topChampions = {},
                summonerMastery = false,
                summonerInfo = false;
            if (
                result &&
                result.summoner_mastery &&
                result.summoner_mastery.mastery_data.length > 0 &&
                result.summoner_info
            ) {
                // store data
                topChampions = result.summoner_mastery.mastery_data.slice(0, 5);
                summonerInfo = result.summoner_info;
                summonerMastery = result.summoner_mastery;

                // create markup template
                var markupCode = SummonerResponseTemplate(summonerInfo, summonerMastery, topChampions, champions);

                // this ID is new, insert into the database
                DatabaseHandler.insert_response(message.id, markupCode);
            }
        },

        // mark a array of messages as read
        markRead: (messages)=> {
            var ids = [];
            messages.map((value) => {
                ids.push(value.id);
            });

            // check if we have atleast 1 message
            if (ids.length > 0) {
                Logging('green', 'Marked messages as read', ids);
                r.markMessagesAsRead(messages);
            }
        },

        // check if the server exists
        serverValid: (server) => {
            if (servers[server.toLowerCase()]) {
                return true;
            }
            return false;
        },

        // check if the champion exists
        championValid: (champion) => {
            var tempChampion = champion.toLowerCase().trim();

            if (champions[tempChampion]) {
                return true;
            } else {
                for (var key in champions) {
                    if (
                        champions[key]['name'].toLowerCase() === tempChampion ||
                        champions[key]['pretty_name'].toLowerCase() === tempChampion ||
                        champions[key]['champkey'].toLowerCase() === tempChampion
                    ) {
                        return true;
                    }
                }
            }
            return false;
        },

        // get all unreadMessages
        checkMessages: () => {
            Logging('bgCyan', 'Checking messages');

            // add a poll count
            callbacks.hasPolled();

            // get unread messages
            r.getUnreadMessages().then((messages) => {
                if (!messages) {
                    Logging('red', 'Failed to load messages');
                    return;
                }

                Logging('cyan', 'New unread messages: ' + messages.length + '');

                // loop through messages
                messages.map((message, index) => {

                    // we only check comments
                    if (message.was_comment) {
                        let messageId = message.id;

                        // add  valid received count
                        callbacks.hasReceived();

                        // check if we've already done this ID
                        DatabaseHandler.is_checked(messageId, (check_result) => {
                            if (check_result.found === false) {

                                // parse all users from the comment
                                var resultingData = Parser.parseBody(message.body);

                                // check the parser results
                                Fetcher.parserCallback(message, resultingData);

                                // this ID is new and has been checked
                                DatabaseHandler.insert_id(check_result.id);
                            } else {
                                Logging('orange', 'Id Exists: ' + check_result.id);
                            }
                        });
                    }
                });

                // mark all messages as read
                Fetcher.markRead(messages);
            }).catch(err => {
                Logging('red', 'Failed to get unread messages');
                Logging('red', err);
            });
        }
    }

    /**/

    return Fetcher;
}