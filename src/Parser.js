const SummonerParser = require('./Commands/Summoner');
const ChampionParser = require('./Commands/Champion');

/**
 * commands
 *
 * /u/mastery_bot crecket / euw
 * u/mastery_bot crecket / euw
 * /u/mastery_bot @champion riven / euw
 * u/mastery_bot @champion riven / any
 *
 */

module.exports = {
    parseBody: (string) => {
        var resultData = {};

        // run through parsers
        resultData.summoners = SummonerParser.parseBody(string);
        resultData.champion_highscores = ChampionParser.parseBody(string);

        // return results
        return resultData;
    }
};