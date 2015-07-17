'use strict';

var _ = require('lodash'),
    request = require('request');

module.exports = function(bot) {

    var name = "tetas";
    var description = "foto tetas";

    var exec = function(msg, reply) {
        request({url:'http://api.oboobs.ru/noise/1', json:true}, function (error, response, body) {
            if (!error && response.statusCode == 200 && body.length > 0) {
                reply.sendChatAction('upload_photo');
                var foto = request("http://media.oboobs.ru/" + body[0].preview);
                reply.sendPhoto(foto);
            } else {
                reply.sendMessage("Error...");
            }
        });
    };

    return {
        name: name,
        exec: exec,
        description: description
    }
};