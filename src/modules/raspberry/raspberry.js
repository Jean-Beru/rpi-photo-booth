var util    = require('util'),
    winston = require('winston');

var Camera,
    stream,
    isStreaming = false;

function isTemp(filename) {
    return '~' === filename.slice(-1);
}

function Stream( opts ) {
    if ( !(this instanceof Stream) ) {
        return new Stream( opts );
    }

    var required = ['module', 'preview', 'photo'];
    for (var i in required) {
       if ('undefined' === typeof opts || 'undefined' === typeof opts[required[i]]) {
           winston.error('Error: raspberry: must define ' + required[i]);
       }
    }

    this.opts = {
        log: winston.info
    };
    this.setOpts(opts);
}

Stream.prototype.setOpts = function(opts) {
    this.opts = util._extend(this.opts, opts);
    this.opts.preview.output = this.formatPath(this.opts.preview.output);
    this.opts.photo.output = this.formatPath(this.opts.photo.output);

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
        .on('start', function() {
            isStreaming = true;
        })
        .on('read', function(err, date, filename) {
            if (isTemp(filename)) {
                return;
            }
            if ('function' === typeof callback) {
                callback.call(this, err, date, filename);
            }
        })
        .start();
};

Stream.prototype.stop = function(callback) {
    winston.info('stop stream');

    stream
        .on('exit', function(err, date) {
            isStreaming = false;
            if ('function' === typeof callback) {
                callback.call(this, err, date);
            }
        })
        .stop();
};

Stream.prototype.capture = function(callback) {
    var self = this;
    var streamListener = stream.listeners('read')[0];

    self.stop(function() {
        self.setOpts({}); // update paths

        winston.info('start capture');
        var capture = new Camera(self.opts.photo);
        capture
            .on('read', function(err, date, filename) {
                if (isTemp(filename)) {
                    return;
                }
                if ('function' === typeof callback) {
                    callback.call(this, err, date, filename);
                }
            })
            .on('exit', function() {
                self.start(streamListener);
            })
            .start();
    });
    return true;
};

module.exports.Stream = Stream;
