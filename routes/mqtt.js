// var express = require('express');
// var router = express.Router();
var common = require('../config/common');
const mqtt = require("mqtt");
const base64js = require('base64-js');
const define = require("../config/define");
const cache = require('../config/cache');
const nodeProcess = require("../services/nodeProcess");


global.client_online  = mqtt.connect(define.MQTT_HOST_ONLINE,{
    username : define.MQTT_USERNAME_ONLINE,
    password : define.MQTT_PASSWORD_ONLINE,
    // reconnectPeriod : 5000,
});

// global.client_local  = mqtt.connect(define.MQTT_HOST_LOCAL,{
//     username : define.MQTT_USERNAME_LOCAL,
//     password : define.MQTT_PASSWORD_LOCAL,
//     // reconnectPeriod : 5000,
// });

global.client_online.on('connect', function () {
    common.console("Online connect success");
    common.console("Online connect sub " + common.GetOTATOPICTX());
    global.client_online.subscribe(common.GetOTATOPICTX());
});
// global.client_local.on('connect', function () {
//     common.console("Local connect success");
//     global.client_local.subscribe(define.LOCAL_MQTT_APPLICATION_TOPIC);
//     global.client_local.subscribe(define.LOCAL_MQTT_APPLICATION_ACK_TOPIC);
//
//     // client_local.subscribe(define.LOCAL_MQTT_GATEWAY_TOPIC);
// });


global.client_online.on('disconnect', function () {
    common.console("Online connect disconnect");
});

global.client_online.on('reconnect', function () {
    common.console("Online connect reconnect");
});


// global.client_local.on('disconnect', function () {
//     common.console("Local connect disconnect");
// });
//
// global.client_local.on('reconnect', function () {
//     common.console("Local connect reconnect");
// });


global.client_online.on('message', function (topic, message) {
    // message is Buffer
    if(topic == common.GetOTATOPICTX()){
        common.console("TOPIC:" + topic +',MSG:'+message.toString());
        nodeProcess.reciveMsg(topic,message);
    }
});

// global.client_local.on('message', function (topic, message) {
//
//
// });


module.exports = {};
