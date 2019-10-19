/**
 * Created by dimenthy on 2017/8/14.
 */
// define.js


var define = {

    //测试环境
    // NETWORK_INTERFACE_NAME : "以太网",
    // OTA_FLODER_PATH : "E:\\OTA",
    // MQTT_HOST_ONLINE : "mqtt://io.stsctech.com:1883",
    // MQTT_HOST_LOCAL : "mqtt://192.168.1.13:1883",
    // REDIS_HOST_LOCAL : "192.168.1.13",
    // LORAOS_PATH  : "E:\\OTA\\LoraOSTest",

    //国内
    NETWORK_INTERFACE_NAME : "eth0",
    OTA_FLODER_PATH : "/home/OTA",
    MQTT_HOST_ONLINE : "mqtt://io.stsctech.com:1883",
    MQTT_HOST_LOCAL : "mqtt://127.0.0.1:1883",
    REDIS_HOST_LOCAL : "127.0.0.1",
    LORAOS_PATH  : '/home/LoraOS',

    //新加坡
    // NETWORK_INTERFACE_NAME : "eth0",
    // OTA_FLODER_PATH : "/home/OTA",
    // MQTT_HOST_ONLINE : "mqtt://loragw.advastech.com:1883",
    // MQTT_HOST_LOCAL : "mqtt://127.0.0.1:1883",
    // REDIS_HOST_LOCAL : "127.0.0.1",
    // LORAOS_PATH  : '/home/LoraOS',


    GATWAY_MIDDLE : "FFFE",
    // NETWORK_PING_URL : "poc.stsctech.com",


    MQTT_USERNAME_ONLINE : 'TYKJadmin',
    MQTT_PASSWORD_ONLINE : 'TYKJ2018.',


    MQTT_USERNAME_LOCAL : 'TYKJadmin',
    MQTT_PASSWORD_LOCAL : 'TYKJ2018.',


    REDIS_PORT_LOCAL : "6379",
    REDIS_PASS_LOCAL : "TYKJ2018.",

    UPDATE_PROCESS : {
        '-2' : "Command ID Error",
        '-1' : "An Upadating is Running",
        '0' : "Receive Message",
        '1' : "Starting Download",
        '2' : "Download Done",
        '3' : "Starting Unzip",
        '4' : "Unzip Done",
        '5' : "Starting Replace",
        '6' : "Replace Done",
        '7' : "Starting RestartService",
        '8' : "RestartService Error",
        '9' : "RestartService Success",
        '10' : "Update FAILED",
    },

    SOFT_LIST : {
        "1" : "LoraOS",
        "2" : "loraserver",
        "3" : "lora-app-server",
    },



    LORAOS_RESTART_CMD  : "/usr/bin/supervisorctl restart LoraOS",






}
module.exports = define;