const assert = require('assert');
const fs = require('fs');
const Parser = require('../src/Parser');
const ChampionHighscoresResponseTemplate = require('../src/ResponseTemplates/ChampionHighscores');
const SummonerResponseTemplate = require('../src/ResponseTemplates/Summoner');

// sample data
const championHighscoreData = JSON.parse(fs.readFileSync('./test/sampleData/championHighscoreData.json'));
const championTestData = JSON.parse(fs.readFileSync('./test/sampleData/championTestData.json'));
const summonerInfoData = JSON.parse(fs.readFileSync('./test/sampleData/summonerInfo.json'));

describe('Parser', function () {
    describe('parseBody', function () {
        var testString =
            "lorem ipsum /u/mastery_bot crecket / euw lorem ipsum " +
            "lorem ipsum u/mastery_bot joeri r / euw lorem ipsum " +
            "lorem ipsum /u/mastery_bot @champion riven / any lorem ipsum " +
            "lorem ipsum u/mastery_bot @champion cho'gath / euw lorem ipsum ";
        var parseResult = Parser.parseBody(testString);

        it('should return object with 2 keys', function () {
            assert.equal(2, Object.keys(parseResult).length);
        });

        it('should find 2 summoners', function () {
            assert.equal(2, Object.keys(parseResult.summoners).length);
        });

        it('should find 2 champion highscores', function () {
            assert.equal(2, Object.keys(parseResult.champion_highscores).length);
        });
    });
});

describe('ResponseTemplates', function () {
    describe('ChampionHighscores', function () {
        it('should generate a non-empty champion highscores teamplte', function () {
            // finish without errors
            var response = ChampionHighscoresResponseTemplate(championHighscoreData.highscores, championTestData.champions);
            assert.ok(response);
        });
    });

    describe('Summoner', function () {
        it('should generate a non-empty summoner template', function () {
            // finish without errors
            var response = SummonerResponseTemplate(
                summonerInfoData.summoner_info,
                summonerInfoData.summoner_mastery,
                summonerInfoData.summoner_mastery.mastery_data.slice(0,5),
                championTestData.champions
            );
            assert.ok(response);
        });
    });
});