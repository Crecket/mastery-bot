module.exports = function (summoner_info, summoner_mastery, topChampions, champions) {
    // header
    var result = "___\nMasterypoints information for [**" +
        summoner_info.name + "** on **" + summoner_info.server.toUpperCase() + "** ^]" +
        "(https://www.masterypoints.com/player/" + summoner_info.name + "/" + summoner_info.server.toUpperCase() + ")\n\n";

    if(!summoner_info.division){
        summoner_info.division = "";
    }

    // total points and other generic data
    result += "*General information*\n\n";
    result += "Type | Value\n" +
        "---------|----------\n";
    result += "Ranked |" + summoner_info.tier + " " + summoner_info.division + "\n";
    result += "Total mastery points |" + summoner_mastery.total_points + "\n";
    result += "Total mastery level |" + summoner_mastery.total_mastery_level + "\n";
    result += "Champions lvl 5 or higher |" + summoner_mastery.total_mastered + "\n";
    result += "Champions played |" + summoner_mastery.total_champions + "\n";
    result += "Last update |" + summoner_mastery.last_mastery_update + " ^^(gmt+2)\n\n";

    // top champions list
    result += "*Top champions*\n\n" +
        "Champions | Points | Masterylevel\n" +
        "---------|----------|----------\n";
    for (var key in topChampions) {
        result += ("[](#c-" + champions[topChampions[key]['champion']]['pretty_name'] + ")" + // icon
        "[" + champions[topChampions[key]['champion']]['name'] + "]" +
        "(https://www.masterypoints.com/highscores/champion/" + champions[topChampions[key]['champion']]['name'] + ")|" +
        topChampions[key]['points'] + "|" +
        topChampions[key]['mastery_level'] + "\n");
    }

    // credits
    result += "___\nI am a bot, beep boop. For more info about the me, [go here](https://www.reddit.com/r/mastery_bot/comments/52ql82/mastery_bot_faq/). \n\n" +
        "To avoid spamming a post with my replies, please [use the website](https://www.masterypoints.com) for a more complete profile.\n___";

    return result;
}