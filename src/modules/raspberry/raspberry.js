var winston  = require('winston');

var options = {
    stream: {
        preview: {
            mode:      'timelapse',
            output:    process.cwd() + '/stream/caption.jpg',
            quality:   3,
            width:     640,
            height:    480,
            timelapse: 1000,
            awb:       'off',
            nopreview: true,
            thumb:     '0:0:0'
        },
        destination: process.cwd() + '/public/photos',
        photo: {
            mode:      'photo',
            output:    '',
            quality:   100,
            width:     1920,
            height:    1080,
            timelapse: 0
        }
    }
};

// Go
var Camera;
var stream;
var isStreaming = false;

module.exports.stream = {
    setCamera: function(type) {
        winston.info('switch to ' + type + ' camera');
        var module = 'raspistill' === type ? 'raspicam' : __dirname + '/../faker';
        Camera = require(module);
    },
    start: function(callback) {
        if (isStreaming) {
            return;
        }

        winston.info('start streaming');
        stream = new Camera(options.stream.preview);
        stream.on('change', function(err, date) {
            callback.call(this, err, date, options.stream.preview.output);
        });
        stream.start();
        isStreaming = true;
    },
    stop: function() {
        stream.stop();
        isStreaming = false;
    },
    capture: function(callback) {
        var self = this;
        self.stop();

        var output = options.stream.destination + '/' + new Date().getTime() + '.jpg';
        options.stream.photo.output = output;
        var capture = new Camera(options.stream.photo);
        capture.on('read', function(err, date) {
            callback.call(this, err, date, output);
        });
        capture.on('exit', function() {
            self.start(stream.listeners('read')[0]);
        });
        capture.start();
    }
};
