'use strict';

var _ = require('lodash'),
	glob = require('glob'),
    mime = require('mime'),
    URL = require('url'),
    path = require('path'),
    stream = require('stream'),
    mimeTypes = require('./mimeTypes.json');


/**
 * Lookup for type (phono, audio, sticker, video, document, location or message)
 */
module.exports.lookupFunctionType = function(data, options) {
	var params = options || {};

    if(params.type)
        return params.type;

    var isFile = params.isFile;
    if(!isFile && typeof data === 'string') {
        return "message";
    }

    if (isFile || data instanceof stream.Stream) {
        var fileName = URL.parse(path.basename(data.path)).pathname;
        var mimeType = params.mime || mime.lookup(fileName);

        if (_.includes(mimeTypes.photo, mimeType))   return "photo";
        if (_.includes(mimeTypes.audio, mimeType))   return "audio";
        if (_.includes(mimeTypes.sticker, mimeType)) return "sticker";
        if (_.includes(mimeTypes.video, mimeType))   return "video";

        return "document";
    }

    if(data instanceof Object && data.lat && data.lng) {
        return "location";
    }
};

/**
 * Parse input command
 */
module.exports.parseCommand = function(txt) {
	var splitText = txt.split(' ');
	return {
		name: splitText.shift().substr(1).split('@')[0],
		params: splitText,
		text: splitText.join(' ')
	}
};


/**
 * Get files by glob patterns, from meanjs project
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			var files = glob.sync(globPatterns);

			if (removeRoot) {
				files = files.map(function(file) {
					return file.replace(removeRoot, '');
				});
			}

			output = _.union(output, files);
		}
	}

	return output;
};