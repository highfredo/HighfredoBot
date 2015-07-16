'use strict';

var math = require("mathjs");

module.exports = function(bot) {

    var name = "calc";
    var description = "simple calculator";

    var exec = function(msg) {
        bot.sendMessage(msg.chat.id, math.eval(msg.command.text));
    };

    return {
        name: name,
        exec: exec,
        description: description,
        help: '/' + name + " [expression] - " + description
    }
};