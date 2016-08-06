var winston = require('winston');

var env = process.env.NODE_ENV || 'production';

winston.info('loading '+env+' configuration');

module.exports = require('./'+env+'.json');
