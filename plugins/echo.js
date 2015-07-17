'use strict';

module.exports = function(bot) {

    var name = "echo";
    var description = "Echo your message";

    var exec = function(msg, reply) {
        reply.sendMessage(msg.command.text);
    };

    return {
        name: name,
        exec: exec,
        description: description,
        help: '/' + name + " [msg] - " + description
    }
};