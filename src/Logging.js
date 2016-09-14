var chalk = require('chalk');

module.exports = function () {

    return function (color, input) {
        var res = input;
        if (color) {
            res = chalk[color](input);
        }

        process.stdout.write(res);

        // ExpressSocket.emit('new comment', {color: color, input: input});
    };

};