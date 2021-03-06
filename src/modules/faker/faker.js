var winston      = require('winston'),
    fs           = require('fs'),
    util         = require('util'),
    eventEmitter = require('events').EventEmitter;

function Faker( opts ) {
    if ( !(this instanceof Faker) ) {
        return new Faker( opts );
    }

    if ('undefined' === typeof opts || 'undefined' === typeof opts.mode || 'undefined' === typeof opts.output) {
        winston.error('Error: faker: must define mode and output');
        return false;
    }
    if ('timelapse' === opts.mode && 'undefined' === typeof opts.timelapse) {
        winston.error('Error: faker: must define time-lapse');
        return false;
    }
    this.opts = opts;
}
util.inherits( Faker, eventEmitter );

var interval = false;

Faker.prototype.start = function() {
    if (false !== interval) {
        return;
    }
    var self = this,
        src  = __dirname + '/stream';

    self.emit( 'start', null, new Date().getTime() );
    fs.readdir(
        src,
        function(err, files) {
            var current;
            switch (self.opts.mode) {
                case 'timelapse' :
                    current = 0;
                    interval = setInterval(
                        function() {
                            if (fs.existsSync(self.opts.output)) {
                                fs.unlinkSync(self.opts.output);
                            }
                            fs.symlinkSync(src + '/' + files[current], self.opts.output);
                            self.emit( 'read', null, new Date().getTime(), self.opts.output );
                            current = ++current === files.length ? 0 : current ;
                        },
                        +self.opts.timelapse
                    );
                    break;
                case 'photo' :
                    current = Math.floor(Math.random() * files.length);
                    setTimeout(
                        function() {
                            var readStream = fs.createReadStream(src + '/' + files[current]);
                            var writeStream = fs.createWriteStream(self.opts.output)
                                .on('close', function() {
                                    self.emit( 'read', null, new Date().getTime(), self.opts.output );
                                    self.stop();
                                });
                            readStream.pipe(writeStream);
                        },
                        +self.opts.timeout
                    );
                    break;
                default:
                    self.emit( 'error', 'Error: mode must be photo or timelapse', new Date().getTime() );
                    return false;

            }
        }
    );
};

Faker.prototype.stop = function() {
    if (false !== interval) {
        clearInterval(interval);
        interval = false;
    }
    this.emit( 'exit', null, new Date().getTime() );
};

Faker.prototype.getOpt = function(opt){
    return this.opts[opt];
};

Faker.prototype.setOpt = function(opt, value){
    this.opts[opt] = value;
};

module.exports = Faker;
