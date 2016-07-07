var snoowrap = require('snoowrap');
var config = require('./src/config.js');
var DatabaseHandler = require('./src/DatabaseHandler.js');

// start sqlite
DatabaseHandler.init(config.sqliteDb);

const r = new snoowrap({
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36 MasteryPointsBot',
    client_id: config.client_id,
    client_secret: config.client_secret,
    username: config.username,
    password: config.password
});

function checkSubreddit(subreddit) {
    r.get_subreddit(subreddit).getNew().then((submissions) => {
        submissions.map((submission, index) => {
            var submission_id = submission.id;

            DatabaseHandler.is_checked(submission_id, () => {
                submission.expand_replies().then((comments)=> {

                });
            });

        });
    });
}
// checkSubreddit('leagueoflegends');

function parseBody(string) {
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
        if(tempSplit.length === 2){
            var summonerName = tempSplit[0];
            var summonerServer = tempSplit[1];
            // push to result list
            result_summoners.push({summoner: summonerName, server: summonerServer});
        }
    }

    return result_summoners;
}

function checkMessages() {
    r.get_inbox().then((messages) => {
        messages.map((message, index) => {
            if (message.was_comment) {
                let messageId = message.id;
                let messageBody = message.body;

                var resultingUsers = parseBody(messageBody);
                console.log(resultingUsers);

                for(var userKey in resultingUsers){

                }
            }
        });
    });
}
checkMessages();

// https://github.com/mapbox/node-sqlite3/wiki/API
// https://github.com/not-an-aardvark/snoowrap
// https://github.com/phito/PlaystvBot


