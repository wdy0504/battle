module.exports = {
  USER: {
    COMMENT_AMOUNT: 'commentAmount', //每天评论次数
    COMMENT_DAY: 'commentDay', //评论的day
    SHELF_AMOUNT: 'shelfAmount',//上架的商品个数
    SHELF_TIMES: 'shelfTimes',//每天上架的次数
    SHELF_DAY: 'shelfDay', //每天上架的day
    REQUEST_AMOUNT: 'requestAmount',  //每秒请求的次数
    REQUEST_SECOND: 'requestSecond', //请求的second
    UPDATEINFO_AMOUNT: 'updateInfoAmount', //每天更新用户资料的次数
    UPDATEINFO_DAY: 'updateInfoDay', //更新用户资料的day
    PREVENT_USERLIST: 'preventUserList', //用户的屏蔽列表
    PREVENT_AMOUNT: 'preventAmount', //每天屏蔽的次数
    PREVENT_DAY: 'preventDay', //屏蔽的day
    NAME: 'name',
    IS_VERITY: 'isVerity' //用户是否通过认证
 },

 LIMIT: {
   COMMENT_AMOUNT: 600,
   SHEKF_AMOUNT: 9,
   SHELF_TIMES: 9,
   REQUEST_AMOUNT: 3,
   UPDATEINFO_AMOUNT: 100,
   PREVENT_AMOUNT: 200,
 },

 ERROR:{
  USER_NOT_LOGIN : 101, //用户没有登录
  SYS_ERROR: 102 //系统错误（数据库异常等）
 }
};