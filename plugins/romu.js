'use strict';

module.exports = function(bot) {

    var name = "echo";
    var description = "Romu's message";

    var exec = function(msg, reply) {
        reply.sendMessage("XD");
    };

    return {
        name: name,
        exec: exec,
        description: description,
        help: '/' + name + " [msg] - " + description
    }
};
