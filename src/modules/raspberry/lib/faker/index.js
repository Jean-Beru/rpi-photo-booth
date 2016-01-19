var fs   = require('fs');
var argv = require('argv');

var args = argv
    .option([
        {
            name: 'output',
            short: 'o',
            type: 'string',
            description: 'Defines output file',
            example: "'faker --output=my_file' or 'faker -o my_file'"
        },
        {
            name: 'timelapse',
            short: 't',
            type: 'int',
            description: 'Timelapse in ms',
            example: "'faker --timelapse=100' or 'faker -t 100'"
        }
    ])
    .run();

var current = 0;
var files = fs.readdirSync(__dirname + '/stream');

setInterval(
    function() {
        fs
            .createReadStream(__dirname + '/stream/' + files[current])
            .pipe(fs.createWriteStream(args.options.output));
        current = ++current === files.length ? 0 : current ;
    },
    500
);
