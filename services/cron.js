// var express = require('express');
// var router = express.Router();
const cron = require('cron');
const common = require('../config/common');

var CronJob = cron.CronJob;

// new CronJob('0 0 * * * *', function() {
//     common.console("Crontab UPDATE HeartBeat !!!");
//
// }, null, true);
new CronJob('0 * * * * *', function() {
    // common.console("GateWayOTA HeartBeat!!!");
    common.gatewayHeart();
}, null, true);


module.exports = {};
