'use strict';

var _ = require('lodash'),
    rp = require('request-promise');


module.exports = function() {

    var name = "rae";
    var description = "busca definiciones en la rae";

    var buscar = function(palabra) {
        var api = "http://dulcinea.herokuapp.com/api/?query=";
        return rp({url:api + palabra, json:true}).then(function(data){
            if(data.status === 'error') {
                return data.message;
            } else if(data.type === "multiple") {
                return buscar(data.response[0].id);
            } else {
                var response = "";
                _.forEach(data.response[0].meanings, function(meaning){
                    response+= ("- " + meaning.meaning + "\n");
                })
                return response;
            }
        });
    }

    var exec = function(msg, reply) {
        var palabra = msg.command.params[0] || "";
        reply.sendChatAction('typing');
        buscar(palabra).then(function(txt){
            reply.sendMessage(txt);
        });
    };

    return {
        name: name,
        exec: exec,
        description: description,
        help: '/' + name + " [palabra] - " + description
    }


};