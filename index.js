'use strict';


var TelegramBot = require('node-telegram-bot-api'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('./utils'),
    conf = require('./conf.json');

var bot = new TelegramBot(conf.bot.token, conf.bot.opts);
bot.plugins = [];


bot.getMe().then(function (me) {
    console.log('Hi my name is %s!', me.username);
});


utils.getGlobbedFiles('./plugins/**/*.js').forEach(function(modelPath) {
    var plugin = require(path.resolve(modelPath))(bot, conf);

    if(!plugin.match) {
        plugin.match = function (msg) {
            return msg.command.name === plugin.name;
        };
    }

    bot.plugins.push(plugin);
    console.log(plugin.name + " loaded.");
});


bot.on('message', function (msg) {
    /* {
         message_id: 76,
         from: { id: 318965, first_name: 'Highfredo', username: 'highfredo' },
         chat: { id: 318965, first_name: 'Highfredo', username: 'highfredo' },
         date: 1437060150,
         text: '/echo hello word'
     } */

    // Parse msg text
    if(_.startsWith(msg.text, '/')) {
        // FIXME: si me nombran no va, ej: /help@HighfredoBot
        var splitText = msg.text.split(" ");
        msg.command = {
            name: splitText.shift().substr(1),
            options: splitText,
            text: splitText.join(' ')
        }
        console.log(msg);
    }


    // Look for plugin
    _.forEach(bot.plugins, function(plugin, index) {
        if(plugin.match(msg)) {
            console.log(plugin.name + " valid.");
            plugin.exec(msg);
            return false;
        } else {
            // console.log(plugin.name + " not valid.");
        }
    });
});