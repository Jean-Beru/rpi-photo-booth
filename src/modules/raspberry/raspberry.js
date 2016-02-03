var util    = require('util'),
    winston = require('winston');

var Camera,
    stream,
    isStreaming = false;


function Stream( opts ) {
    if ( !(this instanceof Stream) ) {
        return new Stream( opts );
    }

    var required = ['module', 'preview_path', 'preview', 'photo_path', 'photo'];
    for (var i in required) {
       if ('undefined' === typeof opts || 'undefined' === typeof opts[required[i]]) {
           winston.error('Error: raspberry: must define ' + required[i]);
       }
    }

    this.opts = {};
    this.setOpts(opts);
}

Stream.prototype.setOpts = function(opts) {
    this.opts = util._extend(this.opts, opts);
    this.opts.preview.output = this.formatPath(this.opts.preview_path);
    this.opts.photo.output = this.formatPath(this.opts.photo_path);

    if ('undefined' !== typeof opts.module) {
        var module = this.opts.module;
        winston.info('switch to ' + module + ' camera');
        try {
            Camera = require(module);
        } catch (e) {
            Camera = require('../' + module);
        }
    }
};

Stream.prototype.formatPath = function(path) {
    return path
        .replace('%root%', process.cwd())
        .replace('%ts%', new Date().getTime());
};

Stream.prototype.start = function(callback) {
    if (isStreaming) {
        return;
    }
    winston.info('start stream');

    var self = this;
    stream = new Camera(self.opts.preview);
    stream
        .on('read', function(err, date, filename) {
            if ('~' === filename.slice(-1)) {
                return;
            }
            callback.call(this, err, date, filename);
        })
        .start();
    isStreaming = true;
    return true;
};

Stream.prototype.stop = function() {
    winston.info('stop stream');

    stream.stop();
    isStreaming = false;
    return true;
};

Stream.prototype.capture = function(callback) {
    this.stop();
    this.setOpts({}); // update paths

    var self = this;

    winston.info('start capture');
    var capture = new Camera(self.opts.photo);
    capture
        .on('exit', function() {
            callback.call(this, '', new Date().getTime(), self.opts.photo.output);
            self.start(stream.listeners('change')[0]);
        })
        .start();
    return true;
};

module.exports.Stream = Stream;
