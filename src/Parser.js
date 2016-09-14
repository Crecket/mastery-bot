const XRegExp = require('xregexp');

module.exports = {
    parseBody: (string) => {
        var result_summoners = [];

        // match all unicode chars in combination with the mastery tag and a server
        var found_matches = XRegExp.matchChain(string, [
            {regex: /(?:([\/]?u\/mastery_bot).{1,17}[\x00-\x7Fa-zA-Z0-g _\\.!/]\/ [a-zA-Z]{2,4})/g},
        ]);

        // loop through regex matches
        for (var matchKey in found_matches) {
            // remove /u/mastery_bot tag
            var tempString = found_matches[matchKey].split("/u/mastery_bot").pop();

            // optional version
            if(tempString.split("u/mastery_bot").length >= 2){
                tempString = tempString.split("u/mastery_bot").pop();
            }

            // split into 2
            var tempSplit = tempString.split(" / ");
            // check if we have correct result
            if (tempSplit.length === 2) {
                var summonerName = tempSplit[0];
                var summonerServer = tempSplit[1];
                // push to result list
                result_summoners.push({
                    summoner: summonerName,
                    server: summonerServer
                });
            }
        }

        return result_summoners;
    }
};