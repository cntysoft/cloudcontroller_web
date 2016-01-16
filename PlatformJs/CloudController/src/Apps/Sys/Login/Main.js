/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.Login.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires : [
      'App.Sys.Login.Ui.LoginPanel',
      'Cntysoft.Framework.Security.Hash.Sha',
      'Cntysoft.Utils.Common',
      'App.Sys.Login.Lang.zh_CN'
   ],

   /**
   * 不安全的类型判断
   *
   * @property {boolean}
   */
   isLoginApp : true,
   /**
   * @inheritdoc
   */
   id : 'Sys.Login',
   /**
   * @inheritdoc
   */
   hasLangText : true,
   /**
   * 系统程序运行
   */
   run : function()
   {
      this.mainPanel = this.setupMainPanel();
      this.mainPanel.render(Ext.getBody());
   },
   /**
   * 异步API
   */
   /**
   * 设置系统主面板 绑定相关
   * @private
   * @param {Ext.panel.Panel} mainPanel
   * @return {Ext.panel.Panel}
   */
   setupMainPanel : function(mainPanel)
   {
      mainPanel = new App.Sys.Login.Ui.LoginPanel({
         appRef : this,
         listeners : {
            loginrequest : this.loginRequestHandler,
            scope : this
         }
      });
      return mainPanel;
   },
   /**
   * 登录请求处理函数
   *
   * @param {string} username
   * @param {string} password
   * @param {string} checkcode
   */
   loginRequestHandler : function(username, password, chkcode)
   {
      CC.login(username, password, chkcode, function(response){
         if(false == response.status) {
            this.mainPanel.removeKeyMap();
            var ERROR_TYPE = this.GET_LANG_TEXT('ERROR_TYPE');
            Cntysoft.processApiError(response, ERROR_TYPE, {
               'CloudController/Kernel/StdErrorType' : {
                  1 : [response.msg]
               }
            }, function(){
               this.mainPanel.setUpKeyMap();
               this.mainPanel.generateChkCode();
            }, this);
         }else {
            //获取初始化进程
            var initProcess = WebOs.PM().getProcessByRunableName('Init', 'Daemon');
            WebOs.PM().killProcess(this.process.getPid());
            initProcess.runable.retrieveSuperManagerProfile();
         }
      }, this);
   },
   /**
   * 处理系统窗口重定义大小事件
   *
   * @param {int} width
   * @param {int} height
   */
   handWindowResize : function(width, height)
   {
      this.mainPanel.setPagePosition((width / 2) - 230, 220, true);
   },
   /**
   * 资源清除
   */
   destroy : function()
   {
      Ext.destroy(this.mainPanel);
      Ext.un('resize', this.handWindowResize, this);
      this.callParent();
   }
});