/**
 * Created by dimenthy on 2017/8/14.
 */
// define.js
const define = require('./define');
const http = require('http');
const querystring = require('querystring');
const cache = require('./cache');
const os=require("os");
const base64js=require("base64-js");
const fs=require("fs");
const dateFormat = require("format-datetime");
const he = require('he');
const path = require('path');


var common = {
    xml_options: {
        attributeNamePrefix : "",
        attrNodeName: "attr", //default is 'false'
        textNodeName : "#text",
        ignoreAttributes : false,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        localeRange: "", //To support non english character in tag/attribute values.
        parseTrueNumberOnly: false,
        attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
        tagValueProcessor : a => he.decode(a) //default is a=>a
    },
    isEmpty : function (str) {
        if(str !== '' && str !== undefined && str !== null && str !== []){
            return false;
        }
        return true;
    },
    postData : function (path,sendData,callback) {
        var options = {
            method: "POST",
            host : define.WEB_HOST,
            port : define.WEB_PORT,
            path : path,
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
            }
        };
        try{
            sendData =querystring.stringify(sendData);
            var req = http.request(options, function(res){
                var data = "";
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    data += chunk;
                    // chunk = JSON.parse(chunk);
                });
                res.on("end", function() {
                    console.log(data);
                    callback(data);
                    // console.log("end");
                });
            });
            req.write(sendData);
            req.on('error',function(err){
                console.log(err);
            });
            req.end();
        }catch (e){
            console.log(e);
        }
    },
    postDataCustom : function (host,port,path,sendData,header,callback) {
        console.log(new Date().toLocaleString()+"   " +"request : " + path);
        try{
            sendData =querystring.stringify(sendData);
            var req_header = {};
            if(sendData.length > 0 ){
                req_header['Content-length'] = Buffer.byteLength(sendData);
                req_header['Content-Type']= 'application/x-www-form-urlencoded';
            }
            req_header = Object.assign(req_header, header);
            var options = {
                method: "POST",
                host : host,
                port : port,
                path : path,
                headers: req_header
            };
            var req = http.request(options, function(res){
                var data = "";
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    data += chunk;
                    // chunk = JSON.parse(chunk);
                });
                res.on("end", function() {
                    // console.log(data);
                    var header = res.headers;
                    callback(data,header);
                    // console.log("end");
                });
            });
            if(sendData.length > 0 ) {
                req.write(sendData);
            }
            req.on('error',function(err){
                console.log(new Date().toLocaleString()+"   " +err);
            });
            req.end();
        }catch (e){
            console.log(new Date().toLocaleString()+"   " +e);
        }
    },
    GetDataWithBaseAuth : function (path,username,password,callback) {
        const Auth = 'Basic '+new Buffer(username + ":" + password).toString('base64');
        var options = {
            method: "GET",
            host : define.WEB_HOST,
            port : define.WEB_PORT,
            path : path,
            headers: {
                'Authorization': Auth,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        try{
            var req = http.request(options, function(res){
                res.setEncoding('utf8');
                var data = "";
                res.on('data', function (chunk) {
                    data += chunk;//nodejs为什么采用这种方式返回网页中的文本
                });
                res.on("end", function() {
                    callback(data);
                    // console.log("end");
                });
            });
            req.on('error',function(err){
                console.log(new Date().toLocaleString()+"   " +err);
            });
            req.end();
        }catch (e){
            console.log(new Date().toLocaleString()+"   " +e);
        }
    },

    GetData : function(url,callback){
        http.get(url,function(res){
            var data = '';
            res.setEncoding('utf-8');
            res.on('data',function(chunk){
                data += chunk;
                // console.log(html);
            })

            res.on('end',function(){
                // var $ = cheerio.load(html);
                // var time = $('.infoTitleW').text();
                callback(data)
            })
        })
    },
    console : function (str) {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(new Date().toLocaleString() + "\t "  + str);
        // console.log(str);
        // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    },
    getToday(){
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
    getNow(){
        return dateFormat(new Date(),"yyyy-MM-dd HH:mm:ss");
    },
    replaceAll(str,ori,replace){
        if(str!=null)
            str = str.replace(new RegExp(ori,"gm"),replace);
        return str;
    },
    Bytes2Str: function(arr)
    {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            var tmp = arr[i].toString(16);
            if (tmp.length == 1) {
                tmp = "0" + tmp;
            }
            str += tmp;
        }
        return str;
    },
    Str2Bytes :function(str)
    {
        var pos = 0;
        var len = str.length;
        if(len %2 != 0)
        {
            return null;
        }
        len /= 2;
        var hexA = new Array();
        for(var i=0; i<len; i++)
        {
            var s = str.substr(pos, 2);
            var v = parseInt(s, 16);
            hexA.push(v);
            pos += 2;
        }
        return hexA;
    },
    PrefixInteger:function(str, length) {
        return (Array(length).join('0') + str).slice(-length);
    },
    GetGWID(){
        var networkInterfaces=os.networkInterfaces();
        var mac=networkInterfaces[define.NETWORK_INTERFACE_NAME][1].mac;
        // this.console("mac："+mac);
        const mac_arr = mac.split(":");
        const gateway_head =  mac_arr[0] + mac_arr[1] + mac_arr[2];
        const gateway_tail =  mac_arr[3] + mac_arr[4] + mac_arr[5];
        return gateway_head + define.GATWAY_MIDDLE + gateway_tail;
    },
    GetOTATOPICTX(){
        // return "123123123";
        return this.GetGWID() + "/OTA/tx" ;
    },
    GetOTATOPICRX(){
        return this.GetGWID() + "/OTA/rx" ;
    },
    GetOTATOPICSTAT(){
        return this.GetGWID() + "/OTA/stats" ;
    },

    createPath(path){
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        fs.chmodSync(path,"0777");
    },
    createFile(path){
        if(!fs.existsSync(path)){

        }
        fs.chmodSync(path,"0777");
    },
    //删除文件夹
    deleteFile(path) {
        var files = [];
        if(fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function(file, index) {
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    common.deleteFile(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    },
    readText(pathname){
        var bin = fs.readFileSync(pathname);
        if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
            bin = bin.slice(3);
        }
        return bin.toString('utf-8');
    },
    getName(){
        //var absPath = path.resolve('../package.json');
        var absPath = __dirname + "/../package.json";
        const json_str = common.readText(absPath);
        var package = JSON.parse(json_str);
        return package['name']
    },
    getVersion(){
        //var absPath = path.resolve('../package.json');
        var absPath = __dirname + "/../package.json";
        const json_str = common.readText(absPath);
        var package = JSON.parse(json_str);
        return package['version']
    },
    gatewayHeart(){
        if(global.client_online.connected ){
            var topic = common.GetOTATOPICSTAT();
            var sendData = {
                "key" : "gatewayHeartBeat",
                "data" : {
                    "gatewayId" : common.GetGWID(),
                    "applicationName" :  common.getName() ,
                    "version" :  common.getVersion() ,
                }
            };
            global.client_online.publish(topic , JSON.stringify(sendData))
        }
    },


}
module.exports = common;