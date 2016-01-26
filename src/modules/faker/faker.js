var fs   = require('fs');
var argv = require('argv');

var args = argv
    .option([
        {
            name: 'output',
            short: 'o',
            type: 'string',
            description: 'Defines output file',
            example: 'faker -o my_file'
        },
        {
            name: 'timelapse',
            short: 't',
            type: 'int',
            description: 'Timelapse in ms',
            example: 'faker -t 100'
        }
    ])
    .run();

var faker = {
    capture: function(output) {
        fs.readdir(
            __dirname + '/stream',
            function(err, files) {
                var random = Math.floor(Math.random() * files.length);
                fs
                    .createReadStream(__dirname + '/stream/' + files[random])
                    .pipe(fs.createWriteStream(output));
            }
        );
    },
    stream: function(output, timelapse) {
        fs.readdir(
            __dirname + '/stream',
            function(err, files) {
                var current = 0;
                setInterval(
                    function() {
                        fs
                            .createReadStream(__dirname + '/stream/' + files[current])
                            .pipe(fs.createWriteStream(output));
                        current = ++current === files.length ? 0 : current ;
                    },
                    timelapse
                );
            }
        );
    }
};

if (args.options.timelapse) {
    faker.stream(args.options.output, args.options.timelapse);
} else {
    faker.capture(args.options.output);
}
