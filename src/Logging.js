var chalk = require('chalk');

module.exports = function () {
    return function (color, input) {
        var res = input;
        if (color) {
            res = chalk[color](input);
        }

        console.log(res);
        // process.stdout.write('\n' + res);

        // ExpressSocket.emit('new comment', {color: color, input: input});
    };
};