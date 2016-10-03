var CLUI = require('clui'),
    clc = require('cli-color'),
    chalk = require('chalk'),
    util = require('util');

module.exports = function (genericInfo, config) {
    // clear
    process.stdout.write("\u001b[2J\u001b[0;0H");

    // display errors
    // console.log(chalk.red('Last 5 errors: '));
    // for (var key in genericInfo.errorList.slice(Math.max(genericInfo.errorList.length - 5, 0))) {
    //     console.log(genericInfo.errorList[key]);
    // }
    // // display messages
    // console.log(chalk.green('Last 5 messages: '));
    // for (var key in genericInfo.messageList.slice(Math.max(genericInfo.messageList.length - 5, 0))) {
    //     console.log(genericInfo.messageList[key]);
    // }

    // output table
    var headerLine = new CLUI.Line()
        .padding(1)
        .column('Recent user', 20, [clc.cyan])
        .column('Poll count', 14, [clc.cyan])
        .column('Received msgs', 20, [clc.cyan])
        .column('Summoners ', 14, [clc.cyan])
        .column('Responses', 14, [clc.cyan])
        .fill()
        .output();
    var columns = new CLUI.Line()
        .padding(1)
        .column(genericInfo.recentUser, 20)
        .column(genericInfo.timesPolled.toString(), 14)
        .column(genericInfo.timesReceived.toString(), 20)
        .column(genericInfo.foundUsers.toString(), 14)
        .column(genericInfo.sentResponses.toString(), 14)
        .fill()
        .output();

    // fallbacks
    if (genericInfo.nextTimer <= 0) {
        genericInfo.nextTimer = 0;
    } else if (genericInfo.nextTimer >= config.pollTimer) {
        genericInfo.nextTimer = config.pollTimer;
    }
    // graph
    console.log(CLUI.Gauge(genericInfo.nextTimer, config.pollTimer, 70,
        config.pollTimer * 0.8, genericInfo.nextTimer / 1000 + " / " + config.pollTimer / 1000
    ));
}