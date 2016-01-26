var fs = require('fs');

module.exports.controller = function(app) {

    app.get('/', function(req, res) {
        fs.readdir(process.cwd() + '/public/photos/', function(err, data) {
            var photos = data.filter(function(file) {
                return null !== file.match(/\.jpg$/i);
            });
            res.render('index', { title: 'RPI Photo Booth', action: 'TAKE A PHOTO', last: photos.slice(0, 12) });
        });
    });

};
