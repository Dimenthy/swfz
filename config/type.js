/**
 * Created by dimenthy on 2017/8/14.
 */
// define.js
//任务类型
var type = {
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
}
module.exports = type;