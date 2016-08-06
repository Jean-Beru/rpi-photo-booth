// Configuration
const config = require('./config');

// Utils
const winston = require('winston');

// ExpressJS
const express        = require('express');
const expressSession = require('express-session');
const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const methodOverride = require('method-override');
const serveStatic    = require('serve-static');
const serveFavicon   = require('serve-favicon');
var app = express();
app.set('port', config.port);
app.set('views', __dirname + '/src/views');
app.set('view engine', 'hjs');
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(cookieParser());
app.use(expressSession({ 'secret': config.secret }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(serveFavicon(__dirname + '/public/favicon.png'));
app.use(serveStatic(__dirname + '/public/'));

// Language
var i18n = require('i18n');
i18n.configure({
    cookie: config.cookieName,
    directory: __dirname + '/locales',
    locales: config.locales
});
app.use(i18n.init);
app.use(function (req, res, next) {
    res.locals.__ = function () {
        return function () {
            return i18n.__.apply(req, arguments);
        };
    };
    next();
});

// Dynamically include routes
var fs = require('fs');
fs.readdirSync('./src/controllers').forEach(function (file) {
    if ('.js' === file.substr(-3)) {
        var route = require('./src/controllers/' + file);
        route.controller(app);
    }
});

// Create server
var server = require('http').createServer(app).listen(app.get('port'), function() {
    winston.info('express server listening on port ' + app.get('port'));
});

// SocketIO
var io = require('socket.io')(server);
var sockets = {};
var Stream = require('./src/modules/raspberry').Stream;
var stream = new Stream(config.raspberry.stream);

io.on('connection', function(socket) {
    winston.info('incoming connection');
    sockets[socket.id] = socket;

    stream.start(function(err, date, file) {
        io.emit('stream', {file: file.split('/').pop()});
    });

    socket.on('disconnect', function() {
        delete sockets[socket.id];

        if (0 === Object.keys(sockets).length) {
            stream.stop();
        }
    });

    socket.on('capture', function() {
        stream.capture(function(err, date, file) {
            // TODO convert file.jpg -quality 75 -resize 200×100 fil.jpg
            var split = file.split('/');
            var input = split.pop();
            var output = input.replace(/\.jpg/ig, '_thumb.jpg');
            var path = split.join('/');

            require('easyimage')
                .resize({
                    src: path+'/'+input,
                    dst: path+'/'+output,
                    quality: 75,
                    width: 160,
                    height: 120
                })
                .then(
                    function() { io.emit('capture', { file: output }); },
                    winston.error
                );
        });
    });
});
