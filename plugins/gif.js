'use strict';

var _ = require('lodash'),
    request = require('request');

module.exports = function(bot) {

    var name = "gif";
    var description = "buscador de gifs";

    var exec = function(msg, reply) {
        var options = {
            url:'http://api.giphy.com/v1/gifs/random',
            qs: {
                tag: msg.command.text || '',
                api_key: 'dc6zaTOxFJmzC'
            },
            json:true
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200 && !_.isEmpty(body.data)) {
                reply.sendChatAction('upload_photo');
                var gif = request(body.data.image_url);
                reply.send(gif);
            } else {
                reply.send("Cannot find gifs...");
            }
        });
    };

    return {
        name: name,
        exec: exec,
        description: description
    }
};