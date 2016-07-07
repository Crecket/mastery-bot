var snoowrap = require('snoowrap');
var config = require('./src/config.js');
var DatabaseHandler = require('./src/DatabaseHandler.js');
var Utils = require('./src/Utils.js');

// start sqlite
DatabaseHandler.init(config.sqliteDb);

const r = new snoowrap({
    user_agent: config.user_agent,
    client_id: config.client_id,
    client_secret: config.client_secret,
    username: config.username,
    password: config.password
});

// DatabaseHandler.insert_id('asdf');

function checkMessages() {
    r.get_inbox().then((messages) => {
        messages.map((message, index) => {
            // we only check comments
            if (message.was_comment) {
                let messageId = message.id;

                // check if we've already done this ID
                DatabaseHandler.is_checked(messageId, (check_result) => {
                    if (check_result.found === false) {
                        // this ID is new
                        DatabaseHandler.insert_id(check_result.id);

                        // parse all users from the comment
                        var resultingUsers = Utils.parseBody(message.body);
                        console.log(resultingUsers);

                        for (var userKey in resultingUsers) {

                        }
                    } else {
                        console.log('Id Exists: ' + check_result.id);
                    }
                });


            }
        });
    });
}
checkMessages();

// https://github.com/mapbox/node-sqlite3/wiki/API
// https://github.com/not-an-aardvark/snoowrap
// https://github.com/phito/PlaystvBot


// function checkSubreddit(subreddit) {
//     r.get_subreddit(subreddit).getNew().then((submissions) => {
//         submissions.map((submission, index) => {
//             var submission_id = submission.id;
//
//             DatabaseHandler.is_checked(submission_id, () => {
//                 submission.expand_replies().then((comments)=> {
//
//                 });
//             });
//
//         });
//     });
// }
// checkSubreddit('leagueoflegends');
