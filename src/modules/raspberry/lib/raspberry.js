var winston  = require('winston');
var cp       = require('child_process');
var chokidar = require('chokidar');
var extend   = require('extend');
var fs       = require('fs');

var options = {
    stream: {
        folder: process.cwd() + '/public/stream/',
        uri: '/stream/',
        filename: 'caption.jpg',
        width: 640,
        height: 480
    }
};

var watcher;
var proc;

module.exports.stream = {
    configure: function (opt) {
        options = extend(options.stream, opt);
    },
    getPath: function() {
        return options.stream.folder + options.stream.filename;
    },
    getUri: function() {
        return options.stream.uri + options.stream.filename;
    },
    start: function(callback) {
        if (watcher) {
            callback.call(this);
            return;
        }

        var path = this.getPath();

        proc = cp.spawn('raspistill', [
            '-w', options.stream.width,
            '-h', options.stream.height,
            '-o', path,
            '-t', '999999999',
            '-tl', '100'
        ]);
        proc.on('error', function() {
            winston.warn('raspistill not available, using faker');
            proc = cp.fork(__dirname + '/faker', [
                '-o', path,
                '-t', '100'
            ]);
        });

        winston.info('Watching for changes on ' + this.getPath() + '...');

        watcher = chokidar.watch(this.getPath());
        watcher
            .on('add', callback.bind(this))
            .on('change', callback.bind(this));
    },
    stop: function() {
        if (proc) {
            proc.kill();
        }
        watcher.unwatch(this.getPath());
        watcher = false;
    }
};
