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

fs.readdir(
    __dirname + '/stream',
    function(err, files) {
        var current = 0;
        setInterval(
            function() {
                fs
                    .createReadStream(__dirname + '/stream/' + files[current])
                    .pipe(fs.createWriteStream(args.options.output));
                current = ++current === files.length ? 0 : current ;
            },
            args.options.timelapse
        );
    }
);
