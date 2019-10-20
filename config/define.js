/**
 * Created by dimenthy on 2017/8/14.
 */
// define.js
const path = require("path");
var PLUG_LOCATION = "D:\\GIT\\swfz\\plug\\";

var define = {
    GAME_NAME : 'sw3main',
    SHOOT_LOCATION : "D:\\GIT\\swfz\\shoots\\",

    // CMDOW_PATH : "D:\\PROGRAM_LIST\\nodejs\\swscript\\plug\\cmdow.exe",
    // CMDOW_CMD : {
    //     LIST : ' /L ',
    //     POS : ' /P '
    // },
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
    WORDS : {
        DONE : {NAME : ['完','成']},
        CONTINUE_MISSION : {NAME : ['继','续','领','取','任','务']},
    },
    THINGS : {
        'HOME' : {  //门派
            HOTKEY : 'f1'
        },
        'FXF' : {   //飞行符
            HOTKEY : 'f2'
        },
        'noMonster' : { //驱魔香
            HOTKEY : 'f3'
        },
        MAP : {
            HOTKEY : 'tab'
        },
        EXIT : {HOTKEY :'escape'}
    },
    TYPE_PP_PERCENT : 66.6,
    TYPE :{
        'SM' : {
            NAME : ['师','门'],
            TYPE : {
                'SJ' : {
                    NAME:['收','集','物','资'],
                    TYPE : {
                        'JY' : {NAME : ['交','易','中','心']}, //交易中心
                        'DP' : {NAME : ['武','器','服','饰','店'] , POS : {out : {l:315,t:360} , in:{l:436,t:495}}},  //武器店 服装店
                        'YD' : {NAME : ['长','安','药','店']}, //药店
                    }
                },
                'TZ' : {NAME:['挑','战']}
            }

        }
    },
    PLACE_PP_PERCENT : 50,
    PLACE : {
        'AL' : {
            CITY : true,
            NAME : ['傲','来','国'],
            FXF_NUM : 2,
        },
        'NE' : {
            CITY : true,
            NAME : ['女','儿','国'],
            FXF_NUM : 5,
        },
        'CA' : {
            CITY : true,
            NAME : ['长','安','城'],
            FXF_NUM : 1,
        },
        'QH' : {
            CITY : true,
            NAME : ['青','河','镇'],
            FXF_NUM : 3,
        },
        'LX' : {
            CITY : true,
            NAME : ['临','仙','镇'],
            FXF_NUM : 4,
        },
        'DF' : {
            CITY : false,
            NAME : ['幽','冥','地','府'],
            FXF_NUM : 0,
            CITY_NEAR : 'NE'
        },
        'HS' : {
            CITY : false,
            NAME : ['佛','门'],
            FXF_NUM : 0,
            CITY_NEAR : 'CA',
            TEACHER_POS: {
                out : {l : 408 , t : 321},
                in : {l:441,t:330},
            },
            MISSION_POS : {l:319,t:359}
        },
    },



}
module.exports = define;