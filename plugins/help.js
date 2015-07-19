'use strict';
var _ = require('lodash');

/*
 ayuda general: /help
 [] -> opcional
 /comando param1 [param2]



 ayuda especifica: /help comando
 /comando param 1 [param2]
 aliases: comando1, comando2, comando3
 por defecto: param2=b
 descripcion
 */

module.exports = function(bot) {

    var name = "help";
    var description = "help plugin";

    var exec = function(msg, reply) {

        var response = "";

        _.forEach(bot.plugins, function(plugin) {
            response += plugin.help || ('/' + plugin.name + " - " + plugin.description);
            response+="\n";
        });

        reply.sendMessage(response);
    };

    return {
        name: name,
        exec: exec,
        description: description
    }
};