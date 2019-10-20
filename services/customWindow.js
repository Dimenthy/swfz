var common = require('../config/common');
const execSync = require('child_process').execSync
const fs = require('fs');
var baiduOcr = require('../config/baiduOcr')
var gameOperate = require('./gameOperate')

var robot = require("robotjs");
robot.setMouseDelay(3);
robot.setKeyboardDelay(3);

/**
 * Created by dimenthy on 2017/8/14.
 */
// define.js
var customWindow = {

    listAllWindow:() =>{
        var output = execSync(common.define.LIST_ALL_WINDOW);
        output = common.utf8ArrayToStr(output);
        common.listWindowStrToJson(output);
        // common.console("GAME INFO:" + JSON.stringify(listGameWindow));
    },


    SM : () =>{
        if(common.global.windowList.length <= 0){
            common.console("获取游戏窗口失败 ，请将游戏窗口置于顶部");
            return;
        }

        var fileName = common.getShoot(common.global.windowList[0]['left']+529,common.global.windowList[0]['top']+166,230,45);
        var filePath = common.define.SHOOT_LOCATION + fileName;
        baiduOcr.generalBasic(filePath).then(res => {
            // common.console(JSON.stringify(res));
            var words_result = res.words_result;
            var mission_title = '';
            var mission_content = '';
            var missionType = {};
            for(var i in words_result){
                var str = words_result[i].words;
                if(i == 0){
                    mission_title = str;
                    missionType = common.getMissionType(str);
                    common.console(JSON.stringify(missionType));
                }else {
                    mission_content += str;
                }
            }
            if(common.isEmpty(missionType['1'])){
                //没有接任务，去接任务
                gameOperate.goHome();
                common.sleepSync(1);
                gameOperate.openMap();
                common.sleepSync(1);
                gameOperate.mouseMove(common.global.windowList[0]['left']+common.global.role.home.TEACHER_POS.out.l, common.global.windowList[0]['top']+common.global.role.home.TEACHER_POS.out.t);  //移到游戏窗口
                gameOperate.mouseClick();
                common.sleepSync(10);
                if(common.global.role.home.TEACHER_POS.hasOwnProperty('in')){
                    gameOperate.openMap();
                    gameOperate.mouseMove(common.global.windowList[0]['left']+common.global.role.home.TEACHER_POS.in.l, common.global.windowList[0]['top']+common.global.role.home.TEACHER_POS.in.t);  //移到游戏窗口
                    gameOperate.mouseClick();
                    common.sleepSync(10);
                }
                gameOperate.mouseMove(common.global.windowList[0]['left']+common.global.role.home.MISSION_POS.l, common.global.windowList[0]['top']+common.global.role.home.MISSION_POS.t);  //移到游戏窗口
                gameOperate.mouseClick();//领取任务点击按钮
                gameOperate.exit();
            }
            var missionPlace = common.getMissionPlace(mission_content);
            common.console('任务类型:'+ common.define.TYPE[missionType['1']]['NAME'] + '->' +common.define.TYPE[missionType['1']]['TYPE'][missionType['2']]['NAME']);
            common.console('任务标题:'+ mission_title);
            common.console('任务内容:'+ mission_content);
            common.console('任务地点:'+ JSON.stringify(common.define.PLACE[missionPlace['1']]));

            if(common.checkMissionDone(mission_title)){
                gameOperate.goHome();
                gameOperate.mouseMove(common.global.windowList[0]['left']+710, common.global.windowList[0]['top']+188);  //移到游戏窗口
                gameOperate.mouseClick();
                return;
            }
            var city_fly_num = gameOperate.getCityFlyNum(missionPlace);
            gameOperate.goCity(city_fly_num); //飞行符飞到城市
            common.sleepSync(1);
            gameOperate.mouseMove(common.global.windowList[0]['left']+710, common.global.windowList[0]['top']+188);  //移到游戏窗口
            common.sleepSync(1);
            gameOperate.mouseClick();//点击自动寻路
            if(missionType['2'] == 'SJ'){  //若为收集物资
                var sjType = gameOperate.getSjType(mission_content);
                common.console("收集物资内容：" + common.define.TYPE.SM.TYPE.SJ.TYPE[sjType['1']]['NAME'] );
                var sjTypeObj = common.define.TYPE.SM.TYPE.SJ.TYPE[sjType['1']];
                common.sleepSync(10);
                gameOperate.mouseMove(common.global.windowList[0]['left']+sjTypeObj.POS.out.l, common.global.windowList[0]['top']+sjTypeObj.POS.out.t);  //移到游戏窗口
                common.sleepSync(1);
                gameOperate.mouseClick();
                if(sjTypeObj.POS.hasOwnProperty('in')){
                    common.sleepSync(2);
                    gameOperate.mouseMove(common.global.windowList[0]['left']+sjTypeObj.POS.in.l, common.global.windowList[0]['top']+sjTypeObj.POS.in.t);  //移到游戏窗口
                    common.sleepSync(1);
                    gameOperate.mouseClick();
                    common.sleepSync(1);
                    gameOperate.exit();
                }
            }

        }).catch(err => {
            common.console(err)
        })



    }






}
module.exports = customWindow;