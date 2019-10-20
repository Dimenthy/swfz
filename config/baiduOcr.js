/**
 * Created by dimenthy on 2017/8/14.
 */
// define.js
const common = require('./common');
const unirest = require('unirest');
var qs = require('querystring');
const fs = require('fs');
var AipOcrClient = require("baidu-aip-sdk").ocr;
var HttpClient = require("baidu-aip-sdk").HttpClient;


var baiduOcr = {
    getData : function (path,method="GET",data={},host='') {
        var url = common.define.BAIDU_AI.HOST + path;
        if(!common.isEmpty(host)){
            url = host + path;
        }
        var afterMethod = null ;
        if(method == "POST"){
            afterMethod = unirest.post(url).headers({ 'Content-Type': 'application/x-www-form-urlencoded'}).send(data);
        }else{
            afterMethod = unirest.get(url);
        }
        return new Promise((resolve,reject) => {
            afterMethod.timeout(10000).strictSSL(true).then((response) => {
                if(response.error){
                    throw new Error("Request Failed");
                }
                resolve(response);
            }).catch(err => {
                reject(err);
            });
        })
    },
    init : () => {
        common.global.baiduAi.client = new AipOcrClient(common.define.BAIDU_AI.APP_ID, common.define.BAIDU_AI.API_KEY, common.define.BAIDU_AI.SECRET_KEY);
        HttpClient.setRequestOptions({timeout: 5000});
        // 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
        // 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
        // request参数请参考 https://github.com/request/request#requestoptions-callback
        HttpClient.setRequestInterceptor(function(requestOptions) {
            // 查看参数
            // console.log(requestOptions)
            // 修改参数
            requestOptions.timeout = 5000;
            // 返回参数
            return requestOptions;
        });
    },
    getAccessToken : () => {
        var param = qs.stringify({
            'grant_type': 'client_credentials',
            'client_id':  common.define.BAIDU_AI.API_KEY,
            'client_secret': common.define.BAIDU_AI.SECRET_KEY
        });
        return new Promise((resolve,reject) => {
            baiduOcr.getData("/oauth/2.0/token?" + param).then(res => {
                resolve(res.body);
            }).catch(err => {
                reject(err);
            })
        })
    },
    //通用文字识别  入参图片base64
    generalBasic : (path) => {
        var image = fs.readFileSync(path).toString("base64");
        return new Promise((resolve,reject) => {
            common.global.baiduAi.client.generalBasic(image).then(function(result) {
                resolve(result);
            }).catch(function(err) {
                // 如果发生网络错误
                reject(err);
            });
        })
    }

}
module.exports = baiduOcr;