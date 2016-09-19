var chalk = require('chalk');

module.exports = function () {
    return function (color, input) {
        var res = input;
        if (color && chalk[color]) {
            res = chalk[color](input);
        }

        // we dont use normal console logs
        // console.log(res);

        // sockets are disabled
        // ExpressSocket.emit('new comment', {color: color, input: input});
    };
};