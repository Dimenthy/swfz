// var express = require('express');
// var router = express.Router();
var common = require('../config/common');
var baiduOcr = require('../config/baiduOcr')

var robot = require("robotjs");

robot.setMouseDelay(3);
robot.setKeyboardDelay(3);


var gameOperate = {
    mouseMove : (left , top , smooth=true, inGame=true,windowNum = 0) => {
        var windowItem = common.global.windowList[windowNum];
        if(inGame){
            left = windowItem['left'] + left;
            top = windowItem['top'] + top;
        }
        if(smooth){
            robot.moveMouseSmooth(left ,top);  //移到游戏窗口
            return;
        }
        robot.moveMouse(left ,top);  //移到游戏窗口
    },
    mouseClick : (flag = 'left') => {
        robot.mouseClick(flag);
    },
    //获取游戏焦点
    getGamePoint : () => {
        gameOperate.mouseMove(common.define.WINDOW_SIZE.WIDTH/2, common.define.WINDOW_SIZE.HEIGHT/2,false);  //移到游戏窗口
        gameOperate.mouseClick();//获取焦点
    },
    init : ()=> {
        return new Promise((resolve ,reject) => {
            gameOperate.getGamePoint();
            gameOperate.getUserHome().then(res => resolve(res)).catch(err => reject(err));
        })
    },
    openMap : () => {
        robot.keyTap(common.define.THINGS.MAP.HOTKEY);
    },
    exit : () => {
        robot.keyTap(common.define.THINGS.EXIT.HOTKEY);
    },
    goHome : () => {
        robot.keyTap(common.define.THINGS.HOME.HOTKEY);
    },
    goCity : (place_fly_num) => {
        if(place_fly_num <0 ) return;
        robot.keyTap(common.define.THINGS.FXF.HOTKEY);
        common.sleepSync(1);
        robot.keyTap( place_fly_num)
    },
    getCityFlyNum : (missionPlace) => {
        // robot.keyTap(common.define.THINGS.FXF.HOTKEY);//开启飞行符
        var place_fly_num = 0;
        if(common.define.PLACE[missionPlace['1']]['CITY']){
            place_fly_num = common.define.PLACE[missionPlace['1']]['FXF_NUM'];
        }else {
            place_fly_num = common.define.PLACE[common.define.PLACE[missionPlace['1']]['CITY_NEAR']]['FXF_NUM'];
        }
        common.console('飞行符编号:' + place_fly_num);
        return place_fly_num;
    },

    getSmMissionDoneButton: ()=>{
        var fileName = common.getShoot(common.global.windowList[0]['left']+285,common.global.windowList[0]['top']+355,100,40);
        var filePath = common.define.SHOOT_LOCATION + fileName;
        return new Promise((resolve ,reject) => {
            baiduOcr.generalBasic(filePath).then(res => {
                resolve(res)
            }).catch(err => {reject(err)})
        })
    },
    //开始师门计时器 ，每30秒检查一次本环师门是否跑完
    startSmMissionInterval: ()=>{
        common.console("======开始SM每环完成度检查=======");
        gameOperate.stopSmMissionInterval();
        common.global.interval.sm = setInterval(()=>{
            gameOperate.getSmMissionDoneButton().then(res => { //截图比对文字 是否继续领取任务
                common.console(res);
                var words_result = res.words_result;
                var mission_content = '';
                for(var i in words_result){
                    mission_content += words_result[i].words;
                }
                if(common.getPercent(mission_content,common.define.WORDS.CONTINUE_MISSION.NAME) > common.define.WORDS_PP_PERCENT
                    || common.isContainer(mission_content,common.define.WORDS.CONTINUE_MISSION.NAME) ){
                    //本环完成 ，
                    gameOperate.stopSmMissionInterval();
                    //继续领取任务
                    gameOperate.clickContinueSmMission();
                    //递归进行检测
                }
            }).catch(err => {})
        },30*1000)
    },
    stopSmMissionInterval:() => {
        if(common.global.interval.sm != null){
            clearInterval(common.global.interval.sm);
            common.global.interval.sm = null;
        }
    },
    clickContinueSmMission:() => {
        for(var i=0 ;i<4 ; i+=20 ){
            gameOperate.mouseMove(common.global.windowList[0]['left']+285,common.global.windowList[0]['top']+377+i);
            gameOperate.mouseClick()
        }
    },
    //获取用户门派
    getUserHome:() => {
        //回门派
        gameOperate.goHome();
        common.sleepSync(2);
        var fileName = common.getShoot(common.global.windowList[0]['left']+63,common.global.windowList[0]['top']+27,87,30);
        var filePath = common.define.SHOOT_LOCATION + fileName;
        return new Promise((resolve ,reject) => {
            baiduOcr.generalBasic(filePath).then(res => {
                var words = '';
                for(var i in res.words_result){
                    words += res.words_result[i]['words']
                }
                var missionPlace = common.getMissionPlace(words);
                var placeObj = common.define.PLACE[missionPlace["1"]];
                if(placeObj != null){
                    common.console("角色门派：" + JSON.stringify(placeObj));
                    common.global.role.home = placeObj;
                }
                resolve(common.global.role.home)
            }).catch(err => {reject(err)})
        })
    },
    //获取师门-收集物资的内类型
    getSjType : (str) => {
        var res = {'1' : null};
        var allSjType = common.define.TYPE.SM.TYPE.SJ.TYPE;
        for(var i in allSjType){
            var SingleSjType = allSjType[i];
            var pp_count = 0;
            for(var j in SingleSjType['NAME']){
                if(str.indexOf( SingleSjType['NAME'][j]) >= 0){
                    pp_count ++;
                }
            }
            if(pp_count *100 /  SingleSjType['NAME'].length >= common.define.PLACE_PP_PERCENT){
                res['1'] = i;
                break;
            }
        }
        return res;


    }

}
module.exports = gameOperate;
