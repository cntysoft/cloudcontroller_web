/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * WEBOS初始化系统守护进程
 */
Ext.define('Daemon.Init.Main', {
   extend : 'WebOs.Kernel.ProcessModel.Daemon',
   requires : [
      'Cntysoft.Utils.Common',
      'Daemon.Init.Lang.zh_CN'
   ],
   auth : null,
   /**
    * 运行程序的名称
    *
    * @property {string} name
    */
   id : 'Init',
   /**
    * 信息提示
    *
    * @property {LoadMask} msgMask
    */
   msgMask : null,
   /**
    * @inheritdoc
    */
   hasLangText : true,

   /**
    * 执行入口代码
    */
   run : function()
   {
      this.tryUserLogin();
      ////这个需要绑定事件
      //Cntysoft.WebOs.addListener('desktopready', function(){
      //   this.runSysDaemon();
      //}, this, {
      //   single : true
      //});
      ////常用程序的引用
      WebOs.R_INIT = this;
   },
   /**
    * 运行系统守护进程
    *
    * @private
    */
   runSysDaemon : function()
   {
      var sysDaemons = [{
         name : 'Kernel',
         module : 'Sys'
      }];
      Ext.each(sysDaemons, function(d){
         Cntysoft.PM().runDaemon(d);
      });
   },
   /**
    * 设置系统环境变量
    *
    * @param {Object} data 服务器端数据
    * @private
    */
   setupSysEnv : function(data)
   {
      var env = this.sysEnv;
      var C = CloudController.Const;
      // 暂时还没有想到放什么信息在环境变量里面
      //放个测试数据
      //系统在渲染Ui的时候需要很多跟UI相关的数据，
      //系统UI组件是分开的，具有树形的关系 但是这里存放数据的时候采用一维的结构，
      //这样便于数据的存取
      env.set(C.ENV_PHP_SETTING, data.phpSetting);
      env.set(C.ENV_SITE_SETTING, data.siteSetting);
      env.set(C.ENV_SYS_SETTING, data.sysSetting);
   },
   /**
    * 设置用户相关信息
    * 
    * @param {Object} data 相关设置
    */
   setupUserInfo : function(data)
   {
      /**
       * 获取当前用户桌面相关数据，
       * 前期就实现 背景 可运行的程序项目 快速启动栏数据
       * 获取之后放入环境变量里面
       * 当前登录用户名称从环境变量里面获取
       */
      //存放用户的程序
      var sysEnv = this.sysEnv;
      var C = CloudController.Const;
      var U = Cntysoft.Utils.Common;
      var A = sysEnv.get(C.ENV_APP);
      //获取当前用户能够运行的应用程序集合
      //一些程序是所有人都必须要运行的

      A.addAll(data.appMetas);
      A.sortBy(function(a, b){
         if (a.order == b.order) {
            return 0;
         } else if (a.order < b.order) {
            return -1;
         } else {
            return 1;
         }
      });
      //@TODO 没有实现守护进程
      sysEnv.set(C.ENV_ACL, data.acl);
      sysEnv.set(C.ENV_CUR_USER, data.sysUserProfile);
      //不安全的超级管理员的判断方法, 仅仅是给UI设计的时候方便点
      sysEnv.set('isSuper', data.isSuper);
      sysEnv.set(C.ENV_SUPPORTED_MODULES, data.supportedModules);
      this.setupSysEnv(data);
      //渲染桌面组件
      WebOs.PM().runApp({
         module : 'Sys',
         name : 'SysUiRender'
      });
   },


   /**
    * 获取超级管理员的详细信息
    */
   retrieveSuperManagerProfile : function()
   {
      WebOs.updateLoadMsg(WebOs.ME.SYS_RETRIEVE_USER_INFO);
      Cntysoft.callApp('Sys', 'User', 'Authorizer/retrieveUserInfo', null, function(response){
         if(!response.status){
            Cntysoft.raiseError(
               Ext.getClassName(this),
               'retrieveSuperManagerProfile',
               'retrieve user info failure : ' + response.msg
            );
         } else{
            this.setupUserInfo(response.data);
         }
      }, this);
   },
   /**
    * 系统登录判断
    */
   tryUserLogin : function()
   {
      WebOs.updateLoadMsg(WebOs.ME.SYS_AUTH);
      try {
         WebOs.loginByCookie(this.loginByCookieHandler, this);
      } catch (e) {

      }
   },
   /**
    * COOKIE登录响应处理函数
    *
    * @param {Object} response
    */
   loginByCookieHandler : function(response)
   {
      if(false == response.status){
         /**
          * 需要利用callback吗？
          */
         WebOs.hideLoadMsg();
         WebOs.PM().runApp({
            name : 'Login',
            module : 'Sys'
         });
      } else{
         this.retrieveSuperManagerProfile();
      }
   },
   renderWebOsUi : function()
   {
      Cntysoft.showLoadMsg(Cntysoft.GET_LANG_TEXT('MSG.PREPARE_DESKTOP'));
      Cntysoft.PM().runApp({
         module : 'Sys',
         name : 'SysUiRender'
      });
   },
   /**
    * 资源清除函数
    */
   destroy : function()
   {
      Ext.destroyMembers(this, 'msgMask');
      delete Cntysoft.R_INIT;
      this.callParent();
   }
});