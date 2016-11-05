const XRegExp = require('xregexp');

module.exports = {
    parseBody: (string) => {
        var highscores_result = [];

        // match all unicode chars in combination with the mastery tag and a server
        var found_matches = XRegExp.matchChain(string, [
            {regex: /(?:([\/]?u\/mastery_bot)\s{1,3}@champion\s{1,2}[a-zA-Z.'_\- ]{2,16}(\/\s{1,2}[a-zA-Z]{2,4}))/g},
        ]);

        // loop through regex matches
        for (var matchKey in found_matches) {
            // remove /u/mastery_bot and @champion tag
            var tempString = found_matches[matchKey].split("@champion").pop();

            // split into 2
            var tempSplit = tempString.split(" / ");
            // check if we have correct result
            if (tempSplit.length === 2) {
                // push to result list
                highscores_result.push({
                    champion: tempSplit[0].trim().toLowerCase(),
                    server: tempSplit[1].trim().toLowerCase()
                });
            }
        }

        return highscores_result;
    }
};