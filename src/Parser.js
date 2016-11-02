const SummonerParser = require('./Commands/Summoner');
const ChampionParser = require('./Commands/Champion');
const TotalParser = require('./Commands/Total');

/**
 * commands
 *
 * /u/mastery_bot crecket / euw
 * u/mastery_bot crecket / euw
 * /u/mastery_bot @champion riven / euw
 * u/mastery_bot @champion riven / any
 * /u/mastery_bot @total euw
 * u/mastery_bot @total any
 *
 */

module.exports = {
    parseBody: (string) => {
        var resultData = {};

        // run through parsers
        resultData.summoners = SummonerParser.parseBody(string);
        resultData.champion_highscores = ChampionParser.parseBody(string);
        // resultData.total_highscores = TotalParser.parseBody(string);

        // return results
        return resultData;
    }
};