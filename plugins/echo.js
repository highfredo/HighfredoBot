'use strict';

module.exports = function(bot) {

    var name = "echo";
    var description = "Echo your message";

    var exec = function(msg) {
        bot.sendMessage(msg.chat.id, msg.command.text);
    };

    return {
        name: name,
        exec: exec,
        description: description,
        help: '/' + name + " [msg] - " + description
    }
};