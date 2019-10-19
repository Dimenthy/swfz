/**
 * Created by dimenthy on 2017/10/6.
 */
var fs = require('fs')
    , Log = require('log')
    , log = new Log('debug', fs.createWriteStream('./logs/log.log'));


module.exports = log;
