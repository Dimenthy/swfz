/**
 * Created by dimenthy on 2017/8/14.
 */
// db.js

const Redis = require('redis');
const define = require("./define");
const common = require("./common");
const bluebird = require("bluebird");
bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);
var redis = {
    oRedis : null,
    oRedisBlocking : null,
    CacheType : {
        INITPARAM : {
            prefix : 'INIT_PARAM:',
            overtime : -1,   //ms
        },
        FIREWARE : {
            prefix : 'FIREWARE:',
            overtime : -1,   //ms
        },
        FIREWARE_PACKAGEINDEX : {
            prefix : 'FIREWARE_PACKAGEINDEX:',
            overtime : -1,   //ms
        },
        FLOW_TOTAL : {
            prefix : 'FLOW_TOTAL:',
            overtime : -1,   //ms
        },
        FLOW_DAY : {
            prefix : 'FLOW_DAY:',
            overtime : -1,   //ms
        },
        CACHE_DATA : {
            prefix : 'CACHE_DATA:',
            overtime : -1,   //ms
        },
    },
    _connect : function () {
        if(this.oRedis == null || !this.oRedis.isConnected){
            if(this.oRedis!=null){
                this._close();
                this.oRedis = null;
            }
            this.oRedis = Redis.createClient(define.REDIS_PORT_LOCAL, define.REDIS_HOST_LOCAL);

            // redis 链接错误
            this.oRedis.on("error", function(error) {
                common.console(error);
            });
            this.oRedis.on("reconnecting", function(obj) {
                common.console("Redis is Reconnecting");
            });

            // redis 验证 (reids.conf未开启验证，此项可不需要)
            this.oRedis.auth(define.REDIS_PASS_LOCAL);

            // this.oRedisBlocking = this.oRedis.duplicate();
        }
    },
    _close : function () {
        this.oRedis.quit();
    },
    _set : function (type,key,value,callback) {
        this._connect();
        var realKey = type['prefix'] + key;
        var overtime = type['overtime'];
        this.oRedis.set(realKey, value , function (err, reply) {
            if (err) throw(err);
            if(overtime > 0){
                this.oRedis.expire(realKey , overtime);
            }
            callback(value);
            // oRedis.expire(realKey, overtime);
            //oRedis.quit();
        });
    },
    _PushDeviceCacheData : function (deviceType,deviceEUI,value) {
        this._connect();
        var realKey = this.CacheType.CACHE_DATA.prefix + deviceType + ":" + deviceEUI;
        var realvalue = JSON.stringify({
            data : value,
            timestamp : Date.parse(new Date())/1000,
        })
        // return new Promise((resolve,reject) => {
            this.oRedis.rpush(realKey,realvalue)
            // .then(function(value) {
            //             //     resolve(value);
            //             // }).catch((err)=>{
            //             //     reject(err);
            //             // });
        // })
    },
    _GetDeviceCacheData : function (deviceType,deviceEUI) {
        this._connect();
        var realKey = this.CacheType.CACHE_DATA.prefix + deviceType + ":" + deviceEUI;
        return new Promise((resolve,reject) => {
            this.oRedis.lrangeAsync(realKey,1,-1).then((value) => {
                resolve(value)
            }).catch((err)=>{
                reject(err);
            });
        })
    },
    _SetInitParam : function (device_type,devEUI,value,callback) {
        this._connect();
        var realKey = this.CacheType.INITPARAM.prefix + device_type + ":" + devEUI;
        var overtime =  this.CacheType.INITPARAM.overtime;
        this.oRedis.set(realKey, value , function (err, reply) {
            if (err) throw(err);
            if(overtime > 0){
                this.oRedis.expire(realKey , overtime);
            }
            callback(value);
        });
    },
    _GetFlowDay:function (monitoringId,date) {
        this._connect();
        var realKey = this.CacheType.FLOW_DAY.prefix  + date + ":" + monitoringId;
        return new Promise((resolve,reject) => {
            this.oRedis.getAsync(realKey).then(function(value) {
                resolve(value)
            }).catch((err)=>{
                reject(err);
            });
        })
    },
    _SetFlowDay:function (monitoringId,date,today_flow) {
        this._connect();
        var realKey = this.CacheType.FLOW_DAY.prefix  + date + ":" + monitoringId;
        return new Promise((resolve,reject) => {
            this.oRedis.setAsync(realKey,today_flow).then(function(value) {
                resolve(value)
            }).catch((err)=>{
                reject(err);
            });
        })
    },
    _SetFirewarePackageIndex : function (device_type,devEUI,value,callback) {
        this._connect();
        var realKey = this.CacheType.FIREWARE_PACKAGEINDEX.prefix + device_type + ":" + devEUI;
        var overtime =  this.CacheType.FIREWARE_PACKAGEINDEX.overtime;
        this.oRedis.set(realKey, value , function (err, reply) {
            if (err) throw(err);
            if(overtime > 0){
                this.oRedis.expire(realKey , overtime);
            }
            callback(value);
        });
    },
    _GetFirewarePackageIndex :function (device_type,devEUI) {
        this._connect();
        var realKey = this.CacheType.FIREWARE_PACKAGEINDEX.prefix + device_type + ":" + devEUI;
        // const value =  this.oRedis.get(realKey);
        // return value;
        return new Promise((resolve,reject) => {
            this.oRedis.getAsync(realKey).then(function(value) {
                resolve(value)
            }).catch((err)=>{
                reject(err);
            });
        })
    },
    _SetFirewarePackage : function (device_type,devEUI,value,callback ) {
        this._connect();
        var realKey = this.CacheType.FIREWARE.prefix + device_type + ":" + devEUI;
        var overtime =  this.CacheType.FIREWARE.overtime;
        var value_obj = {};
        for(var i=0;i<value.length;i++){
            value_obj[i.toString()] = value[i];
        }
        this.oRedis.hmset(realKey, value_obj, function (err, reply) {
            if (err) throw(err);
            if(overtime > 0){
                this.oRedis.expire(realKey , overtime);
            }
            callback(value);
        });
    },
    _GetFirewarePackage : function (device_type,devEUI) {
        this._connect();
        var realKey = this.CacheType.FIREWARE.prefix + device_type + ":" + devEUI;
        return new Promise((resolve,reject) => {
            this.oRedis.hgetallAsync(realKey).then(function(value) {
                resolve(value)
            }).catch((err)=>{
                reject(err);
            });
        })
    },
    _GetInitParam :function (device_type,devEUI) {
        this._connect();
        var realKey = this.CacheType.INITPARAM.prefix + device_type + ":" + devEUI;
        // const value =  this.oRedis.get(realKey);
        // return value;
        return new Promise((resolve,reject) => {
            this.oRedis.getAsync(realKey).then(function(value) {
                resolve(value)
            }).catch((err)=>{
                reject(err);
            });
        })
    },
    _hset : function (type,key,value,callback) {
        this._connect();
        var realKey = type['prefix'] + key;
        var overtime = type['overtime'];
        this.oRedis.hset(realKey, value , function (err, reply) {
            if (err) throw(err);
            if(overtime > 0){
                this.oRedis.expire(realKey , overtime);
            }
            callback(value);
        })
    },
    _get :async function (type,key) {
        this._connect();
        var realKey = type['prefix'] + key;
        return new Promise((resolve,reject) => {
            this.oRedis.getAsync(realKey).then(function(value) {
                resolve(value)
            }).catch((err)=>{
                reject(err);
            });
        })
    },
    _hget : function (type,key,callback) {
        this._connect();
        var realKey = type['prefix'] + key;
        return new Promise((resolve,reject) => {
            this.oRedis.hgetAsync(realKey).then(function(value) {
                resolve(value)
            }).catch((err)=>{
                reject(err);
            });
        })
    },
    _clear : function () {
        this.oRedis.clear();
    },
}
module.exports = redis;