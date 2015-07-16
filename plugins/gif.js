'use strict';

var _ = require('lodash'),
    request = require('request');

module.exports = function(bot) {

    var name = "gif";
    var description = "buscador de gifs";

    var exec = function(msg) {
        request({url:'http://api.giphy.com/v1/gifs/random', qs:{tag: msg.command.text || '', api_key: 'dc6zaTOxFJmzC'}, json:true},
            function (error, response, body) {
                if (!error && response.statusCode == 200 && !_.isEmpty(body.data)) {
                    bot.sendChatAction(msg.chat.id, 'upload_photo');
                    var gif = request(body.data.image_url);
                    bot.sendDocument(msg.chat.id, gif);
                } else {
                    bot.sendMessage(msg.chat.id, "Cannot find gifs...");
                }
        });
    };

    return {
        name: name,
        exec: exec,
        description: description
    }
};