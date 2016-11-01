const XRegExp = require('xregexp');

module.exports = {
    parseBody: (string) => {
        var result_summoners = [];

        // match all unicode chars in combination with the mastery tag and a server
        var found_matches = XRegExp.matchChain(string, [
            {regex: /(?:([\/]?u\/mastery_bot)\s{1,2}[^@][\x00-\x7Fa-zA-Z0-9 _\\.!/]{2,20}\s{1,2}\/\s{1,2}[a-zA-Z]{2,4})/g},
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
            var tempSplit = tempString.split("/");
            // check if we have correct result
            if (tempSplit.length === 2) {
                // push to result list
                result_summoners.push({
                    summoner: tempSplit[0],
                    server: tempSplit[1]
                });
            }
        }

        return result_summoners;
    }
};