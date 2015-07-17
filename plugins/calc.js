'use strict';

var math = require("mathjs");

module.exports = function(bot) {

    var name = "calc";
    var description = "simple calculator";

    var exec = function(msg, reply) {
        reply.sendMessage(math.eval(msg.command.text)+"" || 'Math Error');
    };

    return {
        name: name,
        exec: exec,
        description: description,
        help: '/' + name + " [expression] - " + description
    }
};