'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('./utils'),
    conf = require('./conf.json');



var bot = new TelegramBot(conf.bot.token, conf.bot.opts);
bot.plugins = [];

// Reply functions
var reply = function (chatId) {

    return {
        forwardMessage: function(fromChatId, messageId) {
            return bot.forwardMessage(chatId, fromChatId, messageId)
        },
        sendChatAction: function(action) {
            return bot.sendChatAction(chatId, action);
        },
        send: function(data, options) {
            var funtionType = utils.lookupFunctionType(data, options || {});

            if(funtionType === 'message') {
                return this.sendMessage(data, options);
            } else if(funtionType === 'photo') {
                return this.sendPhoto(data, options);
            } else if(funtionType === 'audio') {
                return this.sendAudio(data, options);
            } else if(funtionType === 'document') {
                return this.sendDocument(data, options);
            } else if(funtionType === 'sticker') {
                return this.sendSticker(data, options);
            } else if(funtionType === 'video') {
                return this.sendVideo(data, options);
            } else if(funtionType === 'location') {
                return this.sendLocation(data.lat, data.lng, options);
            } else {
                throw new Error('Not valid FunctionType');
            }
        },
        sendMessage: function(text, options) {
            return bot.sendMessage(chatId, text, options);
        },
        sendPhoto: function(photo, options) {
            return bot.sendPhoto(chatId, photo, options);
        },
        sendAudio: function(audio, options) {
            return bot.sendAudio(chatId, audio, options);
        },
        sendDocument: function(document, options) {
            return bot.sendDocument(chatId, document, options);
        },
        sendSticker: function(sticker, options) {
            return bot.sendSticker(chatId, sticker, options);
        },
        sendVideo: function(video, options) {
            return bot.sendVideo(chatId, video, options);
        },
        sendLocation: function(latitude, longitude, options) {
            return bot.sendLocation(chatId, latitude, longitude, options);
        }
    }
};

var loadPlugin = function(pluginPath) {
    var plugin = require(path.resolve(pluginPath))(bot, conf);

    // Default match function
    if(!plugin.match) {
        plugin.match = function (msg) {
            return msg.command.name === plugin.name;
        };
    }

    bot.plugins.push(plugin);

    return plugin;
};




/**
 *   MAIN
 **/
// Print Bot Name
bot.getMe().then(function (me) {
    console.log('Hi my name is %s!', me.username);
});

// Load Plugins
utils.getGlobbedFiles('./plugins/**/*.js').forEach(function(pluginPath) {
    var plugin = loadPlugin(pluginPath);
    console.log(plugin.name + " loaded.");
});

// On message
bot.on('message', function (msg) {
    console.log('mensaje recibido');
    /* {
         message_id: 76,
         from: { id: 318965, first_name: 'Highfredo', username: 'highfredo' },
         chat: { id: 318965, first_name: 'Highfredo', username: 'highfredo' },
         date: 1437060150,
         text: '/echo hello word'
     } */

    // Parse msg text
    if(_.startsWith(msg.text, '/')) {
        msg.command = utils.parseCommand(msg.text);
        console.log(msg);
    }


    // Look for plugin
    var foundPlugin = false;
    _.forEach(bot.plugins, function(plugin, index) {
        if(plugin.match(msg)) {
            foundPlugin = true;
            console.log(plugin.name + " valid.");
            plugin.exec(msg, reply(msg.chat.id));
            return false;
        }
    });

    if(!foundPlugin) {
        console.log("No valid plugin found")
    }
});

