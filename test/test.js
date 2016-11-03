const assert = require('assert');
const fs = require('fs');
const Parser = require('../src/Parser');
const ChampionHighscoresResponseTemplate = require('../src/ResponseTemplates/ChampionHighscores');

// sample data
const championHighscoreData = JSON.parse(fs.readFileSync('./test/sampleData/championHighscoreData.json'));
const championTestData = JSON.parse(fs.readFileSync('./test/sampleData/championTestData.json'));

var testString =
    "lorem ipsum /u/mastery_bot crecket / euw lorem ipsum " +
    "lorem ipsum u/mastery_bot crecket / euw lorem ipsum " +
    "lorem ipsum /u/mastery_bot @champion cho'gath / any lorem ipsum " +
    "lorem ipsum u/mastery_bot @champion cho'gath / euw lorem ipsum ";

describe('Parser', function () {
    describe('parseBody', function () {
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
        it('should find 2 champion highscores', function () {
            // finish without errors
            var response = ChampionHighscoresResponseTemplate(championHighscoreData.highscores, championTestData.champions);
            assert.ok(response);
        });
});