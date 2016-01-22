var fs = require('fs');

module.exports.controller = function(app) {

    app.get('/', function(req, res) {
        fs.readdir(process.cwd() + '/public/photos/', function(err, data) {
            console.log(data);
            res.render('index', { title: 'RPI Photo Booth', action: 'TAKE A PHOTO', last: data.slice(0, 4) });
        });
    });

};
