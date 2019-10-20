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
const execSync  = require('child_process').execSync
const mimeType = require('mime-types');
var sleep = require('sleep');


var common = {
    define : define,
    global : {
        windowList : [],
        baiduAi : {
            client : null,
            accessToken : ''
        },
        interval : {
            sm : null
        },
        role : {
            home : null,
        }
    },
    getToday() {
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
    getNow() {
        return dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    },
    sleepSync : (sec) => {
        sleep.sleep(sec);
    },
    ResetBlank : (str) => {
        var regEx = /\s+/g;
        return str.replace(regEx, ' ');
    },
    isEmpty : function (str) {
        if(str !== '' && str !== undefined && str !== null && str !== []){
            return false;
        }
        return true;
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

    console:  (str) => {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        try{
            var info = common.stackInfo();
            var method = info['method'];
            var file = info['file'];
            var line = info['line'];

            var file_info = "[" + method + "] <" + file + ":" + line + "> "

            console.log(new Date().toLocaleString()  + "\t" + file_info + "\t" + str);
        }
        catch (e) {
            console.log(new Date().toLocaleString() + "\t" + str);
        }
        // console.log(str);
        // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    },

    listWindowStrToJson : (str) => {
        var map = {};
        var head = ['Handle','Lev','Pid','WindowStatus','Left','Top','Width','Height','Image','Caption'];
        var strArr = [];
        var arrayRow = str.split("\r\n");
        for(var i in arrayRow){
            if(arrayRow[i].indexOf(common.define.GAME_NAME) >0 ){
                arrayRow[i] = common.ResetBlank(arrayRow[i]);
                var str = arrayRow[i].split(" ");
                if(str[7]<0 || str[8] <0 ){
                    continue
                }
                strArr.push({
                    pid : parseInt(str[2]),
                    left : parseInt(str[7]),
                    top : parseInt(str[8]),
                    width : parseInt(str[9]),
                    height : parseInt(str[10])
                })
            }
        }
        common.global.windowList = strArr;
        return strArr;
    },


    getShoot : (left , top ,width , height)=>{
        // return new Promise((resolve,reject) => {
        var filename = Date.now()+'.png';
        var cmd = common.define.SCRENN_SHOOT.X86 + common.define.SCRENN_SHOOT.CMD.SAVE + common.define.SHOOT_LOCATION + filename+ " " + left + " " + top + " "+ width + " "+ height
        execSync(cmd);//同步方法执行命令
        return filename;
        // })
    },
    // 读取图片文件转换为 base64 编码，并打印到控制台
    parseImgToBase64 : (file) => {
        let filePath = path.resolve(file); // 原始文件地址
        let fileName = filePath.split('\\').slice(-1)[0].split('.'); // 提取文件名
        let fileMimeType = mimeType.lookup(filePath); // 获取文件的 memeType

        // 如果不是图片文件，则退出
        if (!fileMimeType.toString().includes('image')) {
            console.log(chalk.red(`Failed! ${filePath}:\tNot image file!`));
            return;
        }

        // 读取文件数据
        let data = fs.readFileSync(filePath);
        data = new Buffer(data).toString('base64');
        // 转换为 data:image/jpeg;base64,***** 格式的字符串
        let base64 = 'data:' + fileMimeType + ';base64,' + data;
        return base64
    },
    utf8ArrayToStr :(array) => {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while(i < len) {
            c = array[i++];
            switch(c >> 4)
            {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
                case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    },
    //清除目录下文件
    delDir: (path) => {
        let files = [];
        if(fs.existsSync(path)){
            files = fs.readdirSync(path);
            files.forEach((file, index) => {
                let curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()){
                    delDir(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });
            // fs.rmdirSync(path);
        }
    },
    delShootsPath : ()=>{
        common.delDir(common.define.SHOOT_LOCATION)
    },
    getMissionType:(str) => {
        var res = {
            '1': '',
            '2' : ''
        }
        var mission_type = common.define.TYPE;
        for(var i in mission_type){
            var mission_name_arr = mission_type[i]['NAME']
            var all_length = mission_name_arr.length;
            var pp_count = 0;
            for(var j in mission_name_arr){
                var single_mission_name_item = mission_name_arr[j];
                if(str.indexOf(single_mission_name_item) >= 0 ){
                    pp_count ++;
                }
            }
            if(pp_count*100 / all_length >= define.TYPE_PP_PERCENT){
                //如果文字匹配度超过预设的值  则缺人为该项
                var second_mission = mission_type[i]['TYPE'];
                for(var si in second_mission){
                    var second_mission_name_arr =  mission_type[i]['TYPE'][si]['NAME'];
                    var second_all_length = second_mission_name_arr.length;
                    var second_pp_count = 0;
                    for(var sj in second_mission_name_arr) {
                        if(str.indexOf(second_mission_name_arr[sj]) >= 0 ){
                            second_pp_count ++;
                        }
                    }
                    if(second_pp_count*100 / second_all_length >= define.TYPE_PP_PERCENT) {
                        //如果文字匹配度超过预设的值  则缺人为该项
                        res['2'] = si
                        //匹配小类目完成
                        break;
                    }
                }
                //匹配大类目完成
                res['1'] = i
                break;
            }
        }
        return res;
    },
    getMissionPlace:(str) => {
        var res = {'1' : ''}
        var mission_place = common.define.PLACE;
        for(var i in mission_place) {
            var mission_place_name_arr = mission_place[i]['NAME']
            var all_length = mission_place_name_arr.length;
            var pp_count = 0;
            for (var j in mission_place_name_arr) {
                var single_mission_name_item = mission_place_name_arr[j];
                if (str.indexOf(single_mission_name_item) >= 0) {
                    pp_count++;
                }
                if(pp_count * 100 / all_length >= define.PLACE_PP_PERCENT){
                    res['1'] = i;
                    break;
                }
            }
        }
        return res;
    },
    checkMissionDone: (str) => {
        var res = false;
        var mission_done = common.define.WORDS.DONE
        var all_length = mission_done.NAME.length;
        var pp_count = 0;
        for(var i in mission_done.NAME) {
            if (str.indexOf(mission_done.NAME[i]) > 0) {
                pp_count++;
            }
        }
        if(pp_count* 100 / all_length >= define.WORDS_PP_PERCENT){
            res = true
        }
        return res;
    },

    /**
     *
     * @param str  文本
     * @param defineStrArr  定义好的比对文字
     * @returns {number}
     */
    getPercent:(str , defineStrArr) => {
        var percent = 0;
        var all_length = defineStrArr.length;
        var pp_count = 0;
        for(var i in defineStrArr) {
            if (str.indexOf(defineStrArr[i]) >= 0) {
                pp_count++;
            }
        }
        percent = pp_count* 100 / all_length ;
        return percent;
    },
    isContainer:(str , defineStrArr) => {
        return str.indexOf(defineStrArr.join('')) >= 0 ? true : false;
    }


}
module.exports = common;