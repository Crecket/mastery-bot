var chalk = require('chalk');

module.exports = function (ExpressSocket) {

    return function (color, input) {
        var res = input;
        if (color) {
            res = chalk[color](input);
        }
        console.log(res);
        ExpressSocket.emit('new comment', {color: color, input: input});
    };

};