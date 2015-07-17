'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('./utils'),
    mime = require('mime'),
    URL = require('URL'),
    stream = require('stream'),
    conf = require('./conf.json');



var bot = new TelegramBot(conf.bot.token, conf.bot.opts);
bot.plugins = [];

// Reply functions
var reply = function (chatId) {

    var lookupFunctionType = function(data, options) {
        if(typeof data === 'string') {
            return "message"; // TODO: tb se podrian enviar file_id o file_path, de momento solo soporto streams
        }

        if (data instanceof stream.Stream) {
            var fileName = URL.parse(path.basename(data.path)).pathname;
            var mimeType = options.mime || mime.lookup(fileName);

            if (_.includes(conf.mimes.photo, mimeType))   return "photo";
            if (_.includes(conf.mimes.audio, mimeType))   return "audio";
            if (_.includes(conf.mimes.sticker, mimeType)) return "sticker";
            if (_.includes(conf.mimes.video, mimeType))   return "video";

            return "document";
        }

        if(data instanceof Object && data.lat && data.lng) {
            return "location";
        }
    };

    return {
        forwardMessage: function(fromChatId, messageId) {
            return bot.forwardMessage(chatId, fromChatId, messageId)
        },
        sendChatAction: function(action) {
            return bot.sendChatAction(chatId, action);
        },
        send: function(data, options) {
            var funtionType = lookupFunctionType(data, options || {});
            console.log(funtionType);

            if(funtionType === 'message') {
                this.sendMessage(data, options);
            } else if(funtionType === 'photo') {
                this.sendPhoto(data, options);
            } else if(funtionType === 'audio') {
                this.sendAudio(data, options);
            } else if(funtionType === 'document') {
                this.sendDocument(data, options);
            } else if(funtionType === 'sticker') {
                this.sendSticker(data, options);
            } else if(funtionType === 'video') {
                this.sendVideo(data, options);
            } else if(funtionType === 'location') {
                this.sendLocation(data.lat, data.lng, options);
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


var parseCommand = function(txt) {
    var splitText = txt.split(' ');
    return {
        name: splitText.shift().substr(1).split('@')[0],
        params: splitText,
        text: splitText.join(' ')
    }
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
        msg.command = parseCommand(msg.text);
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

