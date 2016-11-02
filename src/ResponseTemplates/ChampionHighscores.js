module.exports = function (highscores, champions) {
    // header
    var result = "";

    // top champions list
    result += "*Champion highscores*\n\n" +
        "Rank  | Champion | Points | Summoner | Server | Level | Ranked\n" +
        "------|----------|--------|----------|--------|-------|-------\n";
    for (var key in highscores) {
        result = result +
            (parseInt(key) + 1) + "|" +

            "[](#c-" + champions[highscores[key]['champion']]['pretty_name'] + ")" + // icon
            "[" + champions[highscores[key]['champion']]['name'] + "]" +
            "(https://www.masterypoints.com/highscores/champion/" + champions[highscores[key]['champion']]['name'] + ")|" +

            highscores[key]['points'] + "|" +

            highscores[key]['name'] + "|" +

            highscores[key]['server'] + "|" +

            highscores[key]['mastery_level'] + "|" +

            highscores[key]['ranked_tier'] + " " + highscores[key]['ranked_division'] +

            "\n";
    }

    // credits
    result += "\n___\nI am a bot, beep boop. For more info about the me, [go here](https://www.reddit.com/r/mastery_bot/comments/52ql82/mastery_bot_faq/). \n\n" +
        "To avoid spamming a post with my replies, please [use the website](https://www.masterypoints.com) for a more complete profile.\n___";

    return result;
}