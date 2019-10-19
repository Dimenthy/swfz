var common = require('../config/common');
const cache = require('../config/cache');
const define = require('../config/define');
const download = require("download");
const base64js = require('base64-js');
const path=require('path');  /*nodejs自带的模块*/
const fs=require('fs');  /*nodejs自带的模块*/
const decompress = require('decompress');
const decompressUnzip = require('decompress-unzip');
var exec = require('child_process').exec;

var nodeProcess = {
    reciveMsg(topic , message){
        try {
            var msg = JSON.parse(message);

            //TODO 监听线上下发的网关ID的topic
            switch (msg.key) {
                ////////////////
                ///////OTA//////
                ////////////////
                case "updateLoraOS" : this.updateLoraOS(msg.data); break;
                case "stopUpdateLoraOS" : this.stopUpdateLoraOS(msg.data); break;  //TODO 暂时废弃
                default:break;
            }
        }catch (e) {
            return;
        }

    },
    /**
     * TODO 远程下发取消更新LoraOS的命令
     {
        "key" : "stopUpdateLoraOS",
        "data" : {
            "commandId": 1,  //指令的数据库ID,
        }
    }
     */
    stopUpdateLoraOS(data){
        //TODO 暂时不用 遇到已经在更新的情况下 返回平台有另一个更新在运行的状态
    },
    /**
     * TODO 远程下发更新LoraOS的命令
     {
        "key" : "updateLoraOS",
        "data" : {
            "commandId": 1,  //指令的数据库ID,
            "src_file" : "https://uploadcnssl.stsctech.com/LoraOS-0.0.2.zip", //替换的文件压缩包  必须zip格式   node_modules 目录打包
        }
    }
     */
    updateLoraOS(data){
        if(global.updating){
            this.FeedBackToCloud(data.commandId, -1);
            return;
        }
        if(common.isEmpty(data.commandId)){
            this.FeedBackToCloud(data.commandId, -2);
            //不带上数据库id 认为是无效指令
            return ;
        }
        global.updating = true;
        this.FeedBackToCloud(data.commandId, 0);
        var download_url = data.src_file;
        common.createPath(define.OTA_FLODER_PATH);
        if (common.isEmpty(download_url)) {
            return;
        }
        var filepath = define.OTA_FLODER_PATH + path.sep + path.basename(download_url);
        var LoraOS_bak = define.LORAOS_PATH + "_BAK";
        var unzipPath = define.OTA_FLODER_PATH + path.sep + path.basename(download_url, '.zip');
        common.createPath(unzipPath);
        try {
            this.FeedBackToCloud(data.commandId, 1);
            download(download_url).then(file_data => {
                fs.writeFileSync(filepath, file_data);
            }).then(() => {
                common.console('Download Finish : ' + filepath);
                this.FeedBackToCloud(data.commandId, 2);

                this.FeedBackToCloud(data.commandId, 3);
                decompress(filepath, unzipPath, {
                    plugins: [
                        decompressUnzip()
                    ]
                }).then(() => {
                    common.console('Files decompressed : ' + unzipPath);
                    this.FeedBackToCloud(data.commandId, 4);
                    //解压完成后开始替换文件
                    this.FeedBackToCloud(data.commandId, 5);
                    common.deleteFile(LoraOS_bak);
                    fs.renameSync(define.LORAOS_PATH, LoraOS_bak);
                    fs.renameSync(unzipPath, define.LORAOS_PATH);
                    this.FeedBackToCloud(data.commandId, 6);
                    common.console('Files replaced : ' + define.LORAOS_PATH);
                    //执行重启命令

                    this.FeedBackToCloud(data.commandId, 7);
                    //nodejs驱动程序开始重启
                    common.console('LoraOS Restart Begin!!!');
                    exec(define.LORAOS_RESTART_CMD, (err, stdout, stderr) => {
                        if (err) {
                            //驱动程序重启失败
                            this.FeedBackToCloud(data.commandId, 8);
                            common.console('LoraOS Restart Error!!!');
                            common.console('SHELL ERROR:' + stderr);
                        } else {
                            //驱动程序重启成功
                            this.FeedBackToCloud(data.commandId, 9);
                            common.console('LoraOS Restart Success!!!');
                            common.console('SHELL LOG :' + stdout);
                        }
                    });
                    //更新完删除更新包
                    common.console('Download File Deleted!!!');
                    fs.unlinkSync(filepath);
                    global.updating = false;
                });
            });
        }catch (e) {
            common.console('Update LoraOS Failed !!!');
            this.FeedErrorToCloud(data.commandId,e.message);
            common.console('Download File Deleted!!!');
            fs.unlinkSync(filepath);
            global.updating = false;
        }

    },
    /**
     *
     * @param commandId
     * @param status
     * @constructor
     {
        "key" : "updateLoraOSFeedBack",
        "data" : {
            "commandId": 1,  //指令的数据库ID,
            "status" : 0,
            "message" : "Receive Message",
        }
    }
     */
    FeedBackToCloud(commandId,status){
        var sendMsg = {
            "key": "updateLoraOSFeedBack",
            "data": {
                "commandId": 1,  //指令的数据库ID,
                "status": status,
                "message": define.UPDATE_PROCESS[status],
            }
        };
        global.client_online.publish(common.GetOTATOPICRX(),JSON.stringify(sendMsg));
    },
    FeedErrorToCloud(commandId,message){
        var sendMsg = {
            "key": "updateLoraOSFeedBack",
            "data": {
                "commandId": 1,  //指令的数据库ID,
                "status": 10,
                "message": message,
            }
        };
        global.client_online.publish(common.GetOTATOPICRX(),JSON.stringify(sendMsg));
    },





}

module.exports = nodeProcess;
