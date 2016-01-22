var winston  = require('winston');
var cp       = require('child_process');
var chokidar = require('chokidar');
var extend   = require('extend');

var options = {
    stream: {
        path: process.cwd() + '/stream/caption.jpg',
        width: 640,
        height: 480,
        timelapse: 500,
    }
};

var watcher;
var proc;

module.exports.stream = {
    configure: function (opt) {
        options = extend(options.stream, opt);
    },
    getPath: function() {
        return options.stream.path;
    },
    start: function(callback) {
        var path = this.getPath();

        if (watcher) {
            callback.call(this, path);
            return;
        }

        proc = cp.spawn('raspistill', [
            '-w', options.stream.width,
            '-h', options.stream.height,
            '-o', path,
            '-t', '999999999',
            '-tl', options.stream.timelapse
        ]);
        proc.on('error', function() {
            winston.warn('raspistill not available, using faker');
            proc = cp.fork(__dirname + '/../faker', [
                '-o', path,
                '-t', options.stream.timelapse
            ]);
        });

        winston.info('Watching for changes on ' + path + '...');

        watcher = chokidar.watch(path);
        watcher
            .on('add', callback.bind(this, path))
            .on('change', callback.bind(this, path));
    },
    stop: function() {
        if (proc) {
            proc.kill();
        }
        watcher.unwatch(this.getPath());
        watcher = false;
    }
};
