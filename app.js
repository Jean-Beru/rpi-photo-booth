// Configuration
var config = require('./config');

// Utils
var winston = require('winston');

// ExpressJS
var express        = require('express');
var expressSession = require('express-session');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var morgan         = require('morgan');
var serveStatic    = require('serve-static');
var serveFavicon   = require('serve-favicon');
var app = express();
app.set('port', config.port);
app.set('views', __dirname + '/src/views');
app.set('view engine', 'hjs');
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(cookieParser());
app.use(expressSession({ 'secret': config.secret }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(morgan('combined'));
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
var server = require('http').createServer(app).listen(app.get('port'), function(){
    winston.log('info', 'Express server listening on port ' + app.get('port'));
});

// SocketIO
var raspberry = require('./src/modules/raspberry');
var io = require('socket.io')(server);
var sockets = {};
io.on('connection', function(socket) {
    sockets[socket.id] = socket;

    raspberry.stream.start(function(path) {
        fs.readFile(path, function(err, data) {
            if ('' !== data) {
                io.emit('stream', { stream: data.toString('base64') });
            }
        });
    });

    socket.on('disconnect', function() {
        delete sockets[socket.id];

        if (0 === Object.keys(sockets).length) {
            raspberry.stream.stop();
        }
    });
});
io.on('capture', function() {
    raspberry.stream.capture(function(file) {
       io.emit('capture', { file: file });
    });
});
