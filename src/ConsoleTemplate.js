var CLUI = require('clui'),
    clc = require('cli-color'),
    util = require('util');

module.exports = function (genericInfo, config) {
    // clear
    process.stdout.write("\u001b[2J\u001b[0;0H");

    // display errors
    for (var key in genericInfo.errorList) {
        console.log(genericInfo.errorList[key]);
    }

    // output table
    var headerLine = new CLUI.Line()
        .padding(1)
        .column('Recent user', 20, [clc.cyan])
        .column('Times polled', 20, [clc.cyan])
        .column('Received msgs', 20, [clc.cyan])
        .column('Found summoners', 20, [clc.cyan])
        .column('Responses sent', 20, [clc.cyan])
        .fill()
        .output();
    var columns = new CLUI.Line()
        .padding(1)
        .column(genericInfo.recentUser, 20)
        .column(genericInfo.timesPolled.toString(), 20)
        .column(genericInfo.timesReceived.toString(), 20)
        .column(genericInfo.foundUsers.toString(), 20)
        .column(genericInfo.sentResponses.toString(), 20)
        .fill()
        .output();
    // var os   = require('os'),
    //     clui = require('clui');
    //
    // var Gauge = clui.Gauge;
    //
    // var total = os.totalmem();
    // var free = os.freemem();
    // var used = total - free;
    // var human = Math.ceil(used / 1000000) + ' MB';
    //
    // console.log(Gauge(used, total, 70, total * 0.8, human));
}