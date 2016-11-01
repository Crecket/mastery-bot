const XRegExp = require('xregexp');

module.exports = {
    parseBody: (string) => {
        var total_results = [];

        // match all unicode chars in combination with the mastery tag and a server
        var found_matches = XRegExp.matchChain(string, [
            {regex: /(?:([\/]?u\/mastery_bot)\s{1,3}@total\s{1,2}[a-zA-Z]{2,4})/g},
        ]);

        // loop through regex matches
        for (var matchKey in found_matches) {
            // remove /u/mastery_bot and @champion tag
            var tempString = found_matches[matchKey].split("@total").pop();

            // push to result list
            total_results.push({
                server: tempString.trim()
            });
        }

        return total_results;
    }
};