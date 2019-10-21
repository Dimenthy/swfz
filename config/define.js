/**
 * Created by dimenthy on 2017/8/14.
 */
// define.js
const path = require("path");
var PLUG_LOCATION = path.join(__dirname,'../plug/');
var place = require('./place');
var missionType = require('./type');
var hotkey = require('./hotkey');
var words = require('./words');

var define = {
    GAME_NAME : 'sw3main',
    WINDOW_SIZE : {
        WIDTH : 800,
        HEIGHT:600,
    },
    SHOOT_LOCATION : path.join(__dirname,"../shoots/"),

    LIST_ALL_WINDOW  : PLUG_LOCATION + "cmdow.exe /t /P ",

    SCRENN_SHOOT : {
        "CMD" : {
            "SAVE" :   " savescreenshot "
        },
        'X86' : PLUG_LOCATION + "nircmd" + path.sep + "nircmd" + path.sep + "nircmd.exe ",
        'X64' : PLUG_LOCATION + "nircmd" + path.sep + "nircmd-x64" + path.sep + "nircmd.exe "
    },

    BAIDU_AI :{
        HOST : 'https://aip.baidubce.com',
        APP_ID:'17569579',
        API_KEY : 'yxEeiBdC1vEk8uE3QsG5hoGw',
        SECRET_KEY : 'VUVnEZz4FM6IhRFgNikKWFYNntnS88oI',
    },
    WORDS_PP_PERCENT: 50,
    WORDS : words,
    THINGS : hotkey,
    TYPE_PP_PERCENT : 66.6,
    TYPE :missionType,
    PLACE_PP_PERCENT : 50,
    PLACE : place


}
module.exports = define;