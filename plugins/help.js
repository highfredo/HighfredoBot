'use strict';
var _ = require('lodash');


module.exports = function(bot) {

    var name = "help";
    var description = "help plugin";

    var exec = function(msg) {

        var response = "";

        _.forEach(bot.plugins, function(plugin) {
            response += plugin.help || ('/' + plugin.name + " - " + plugin.description);
            response+="\n";
        });

        bot.sendMessage(msg.chat.id, response);
    };

    return {
        name: name,
        exec: exec,
        description: description
    }
};