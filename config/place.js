/**
 * Created by dimenthy on 2017/8/14.
 */
// define.js

var place = {
    //城市
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

    //野外
    'WSZ' : {
        CITY : false,
        NAME : ['乌','斯','藏'],
        FXF_NUM : 0,
        CITY_NEAR : 'LX'
    },
    'KLS' : {
        CITY : false,
        NAME : ['昆','仑','山'],
        FXF_NUM : 0,
        CITY_NEAR : 'LX'
    },
    'HGS' : {
        CITY : false,
        NAME : ['花','果','山'],
        FXF_NUM : 0,
        CITY_NEAR : 'AL'
    },
    'JW' : {
        CITY : false,
        NAME : ['大','唐','境','外'],
        FXF_NUM : 0,
        CITY_NEAR : 'NE'
    },
    'GJ' : {
        CITY : false,
        NAME : ['大','唐','国','境'],
        FXF_NUM : 0,
        CITY_NEAR : 'CA'
    },
    'CAW' : {
        CITY : false,
        NAME : ['长','安','城','外'],
        FXF_NUM : 0,
        CITY_NEAR : 'CA'
    },
    'QHW' : {
        CITY : false,
        NAME : ['青','河','镇','外'],
        FXF_NUM : 0,
        CITY_NEAR : 'QH'
    },

    //门派
    'PS' : {
        CITY : false,
        NAME : ['盘','丝','岭'],
        FXF_NUM : 0,
        CITY_NEAR : 'NE',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
            in : {l:0,t:0},
        },
        MISSION_POS : {l:0,t:0}
    },
    'DF' : {
        CITY : false,
        NAME : ['幽','冥','地','府'],
        FXF_NUM : 0,
        CITY_NEAR : 'NE',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
            in : {l:0,t:0},
        },
        MISSION_POS : {l:0,t:0}
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
    'DT' : {
        CITY : false,
        NAME : ['天','策'],
        FXF_NUM : 0,
        CITY_NEAR : 'CA',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
            in : {l:0,t:0},
        },
        MISSION_POS : {l:0,t:0}
    },
    'PT' : {
        CITY : false,
        NAME : ['南','海','普','陀'],
        FXF_NUM : 0,
        CITY_NEAR : 'CA',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
        },
        MISSION_POS : {l:0,t:0}
    },
    'LG' : {
        CITY : false,
        NAME : ['东','海','龙','宫'],
        FXF_NUM : 0,
        CITY_NEAR : 'AL',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
            in : {l:0,t:0},
        },
        MISSION_POS : {l:0,t:0}
    },
    'FC' : {
        CITY : false,
        NAME : ['七','星','方','寸'],
        FXF_NUM : 0,
        CITY_NEAR : 'LX',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
            in : {l:0,t:0},
        },
        MISSION_POS : {l:0,t:0}
    },
    'WZ' : {
        CITY : false,
        NAME : ['镇','元','五','庄'],
        FXF_NUM : 0,
        CITY_NEAR : 'LX',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
            in : {l:0,t:0},
        },
        MISSION_POS : {l:0,t:0}
    },
    'MW' : {
        CITY : false,
        NAME : ['魔','王','山'],
        FXF_NUM : 0,
        CITY_NEAR : 'LX',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
        },
        MISSION_POS : {l:0,t:0}
    },
    'TG' : {
        CITY : false,
        NAME : ['凌','霄','天','宫'],
        FXF_NUM : 0,
        CITY_NEAR : 'LX',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
            in : {l:0,t:0},
        },
        MISSION_POS : {l:0,t:0}
    },
    'TM' : {
        CITY : false,
        NAME : ['天','魔','里'],
        FXF_NUM : 0,
        CITY_NEAR : 'AL',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
            in : {l:0,t:0},
        },
        MISSION_POS : {l:0,t:0}
    },
    'ST' : {
        CITY : false,
        NAME : ['万','兽','岭'],
        FXF_NUM : 0,
        CITY_NEAR : 'LX',
        TEACHER_POS: {
            out : {l : 0 , t : 0},
            in : {l:0,t:0},
        },
        MISSION_POS : {l:0,t:0}
    },

}
module.exports = place;