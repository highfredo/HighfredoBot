'use strict';

var _ = require('lodash'),
    request = require('request');


module.exports = function(bot) {

    var name = "4chan";
    var description = "4chan random pics";

    var exec = function(msg) {

        var board = msg.command.options[0] || 'b';

        request({url:'https://a.4cdn.org/'+board+'/threads.json', json:true},
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    bot.sendChatAction(msg.chat.id, 'upload_photo');
                    var randomPage = _.random(body.length - 1);
                    var threads = body[randomPage].threads;
                    var randomThread = _.random(threads.length - 1);
                    var threadId = threads[randomThread].no;

                    request({url:'https://a.4cdn.org/'+board+'/thread/'+ threadId +'.json', json:true}, function(error, response, body) {
                        var posts = _.filter(body.posts, function(p) { return p.filename });
                        var randomPost = _.random(posts.length - 1);
                        var post = posts[randomPost];

                        var document = request('https://i.4cdn.org/'+board+'/'+ post.tim + post.ext);
                        if(_.includes([".jpeg", ".jpg", ".png"], post.ext))
                            bot.sendPhoto(msg.chat.id, document);
                        else
                            bot.sendDocument(msg.chat.id, document);
                    });
                } else {
                    bot.sendMessage(msg.chat.id, "Error...");
                }
            });
    };

    return {
        name: name,
        exec: exec,
        description: description,
        help: '/' + name + " [boardId] - " + description
    }
};