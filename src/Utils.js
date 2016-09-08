module.exports = {
    parseBody: (string) => {
        var found_matches = [];
        var result_summoners = [];
        var regexPattern = /(?:(\/u\/mastery_bot).{1,25}[a-zA-Z0-9] \/ [a-zA-Z]{2,4})/g;
        var m;

        // do regex check
        do {
            m = regexPattern.exec(string);
            if (m) {
                found_matches.push(m[0])
            }
        } while (m);

        // loop through regex matches
        for (var matchKey in found_matches) {
            // remove /u/mastery_bot tag
            var tempString = found_matches[matchKey].split("/u/mastery_bot").pop();
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