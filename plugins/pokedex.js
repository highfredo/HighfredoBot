'use strict';

var _ = require('lodash'),
    rp = require('request-promise'),
    request = require('request');


module.exports = function() {

    var name = "pokedex";
    var description = "soy una pokedex";

    var pokedex = function(pokemonQuery) {
        var api = "http://pokeapi.co/api/v1/pokemon/";
        var base = "http://pokeapi.co";
        var pokemonInfo = {};
        return rp({url:api + pokemonQuery, json:true})
            .then(function(pokemon) {
                pokemonInfo.text = 'Pokédex ID: ' + pokemon.pkdx_id
                    +'\nNombre: ' + pokemon.name
                    +'\nPeso: ' + (pokemon.weight/10) + " kg" // dividir entre 10
                    +'\nAltura: ' + (pokemon.height/10) + " m" // dividir entre 10
                    +'\nVelocidad: ' + pokemon.speed;

                // console.log(pokemonInfo.text);
                return rp({url:base + pokemon.sprites[0].resource_uri, json:true});
            })
            .then(function (spriteInfo) {
                pokemonInfo.image = request(base + spriteInfo.image);
                return pokemonInfo;
            });
    }

    var exec = function(msg, reply) {
        var pokemon = msg.command.params[0] || "";
        reply.sendChatAction('typing');
        pokedex(pokemon)
            .then(function(pokemonInfo){
                reply.send(pokemonInfo.image)
                    .then(function(){
                        reply.sendMessage(pokemonInfo.text);
                    })
            })
            .catch(function(){
                reply.sendMessage("No se ha encontrado ningún pokemon");
            });
    };

    return {
        name: name,
        exec: exec,
        description: description,
        help: '/' + name + " [palabra] - " + description
    }


};