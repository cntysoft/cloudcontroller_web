/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统WebOs总体环境渲染程序, 这个程序很特殊， 本身没有服务器端支持
 */
Ext.define('App.Sys.SysUiRender.Main', {
   extend : 'WebOs.Kernel.ProcessModel.Runable',
   requires : [
      'WebOs.OsWidget.Desktop',
      'Cntysoft.Utils.Common',
      'App.Sys.SysUiRender.Lang.zh_CN',
      'WebOs.Kernel.StdHandler'
   ],
   mixins : {
      callSys : 'Cntysoft.Mixin.CallSys'
   },
   scriptName : 'WebOs',
   /**
    * 程序名称
    *
    * @property {string} id
    */
   id : 'Sys.SysUiRender',
   /**
    * @property {Cntysoft.Ds.SysInfo} sysInfo
    */
   sysInfo : null,
   /**
    * 系统标准的处理处理函数对象
    *
    * @param {WebOs.Kernel.StdHandler} stdHandler
    */
   stdHandler : null,
   /**
    * 这个APP有点特殊
    *
    * @property {String} runableType
    */
   runableType : 'App',
   /**
    * 建立一个引用，其余的组件都可以通过这个组件获取，整个系统组件以一种树形结构呈现出来
    *
    * @property {WebOs.OsWidget.Desktop} desktop
    */
   desktop : null,
   /**
    * 桌面环境相关组件的引用
    *
    * @property {Ext.util.HashMap} osWidget
    */
   osWidgetMap : null,
   /**
    * 构造函数
    * 初始化系统的支持的桌面原生对象
    *
    * @param {object} config
    */
   constructor : function(config)
   {
      WebOs.updateLoadMsg(WebOs.ME.SYS_RENDER_WEBOS);
      this.callParent([config]);
      this.osWidgetMap = new Ext.util.HashMap();
      WebOs.R_SYS_UI_RENDER = this;
      this.initOsEnvInfo();
      this.stdHandler = new WebOs.Kernel.StdHandler();

   },
   /**
    * @template
    * @return string
    */
   getLangCls : function()
   {
      return [WebOs.Const.RUN_TYPE_APP, this.module, this.name, 'Lang', Cntysoft.getLangType()].join('.');
   },
   /**
    * @inheritdoc
    */
   setupIdHandler : function()
   {
      var ids = this.id.split('.');
      this.module = ids[0];
      this.name = ids[1];
   },
   /**
    * 入口程序
    */
   run : function(runConfig)
   {
      this.desktop = new WebOs.OsWidget.Desktop({
         appRef : this
      });
   },
   /**
    * 保存桌面APP的虚拟桌面的排列顺序
    *
    * @param {Array} data
    * {
     *      'AppKey' : order
     * }
    */
   updateAppVdOrder : function(data, callback, scope)
   {
      this.callSys('updateAppVdOrder', data, callback, scope);
   },
   /**
    * 获取系统OS环境组件对象
    *
    * @param {string} name
    */
   getOsWidget : function(name)
   {
      if(Ext.Array.contains(this.getOsWidgetTypes(), name)){
         return this.osWidgetMap.get(name);
      }
      Cntysoft.raiseError(
         Ext.getClassName(this),
         'getOsWidget',
         'Widget : ' + name + ' is not supported'
      );
   },
   /**
    * 设置桌面环境组件对象引用
    *
    * @param {String} name
    * @param {Ext.Component} widget
    * @return {Cntysoft.App.Sys.SysUiRender.Main}
    */
   setOsWidget : function(name, widget)
   {
      this.osWidgetMap.add(name, widget);
      return this;
   },
   /**
    * 获取标准处理函数对象
    *
    * @return {Cntysoft.Framework.Core.StdHandler}
    */
   getStdHandler : function()
   {
      return this.stdHandler;
   },
   /**
    * 获取操作系统类型以及相关类
    *
    * @return {object}
    */
   getOsWidgetTypes : function()
   {
      return [
         'WEBOS_DESKTOP',
         'WEBOS_SYS_MENU',
         'WEBOS_START_BTN',
         'WEBOS_APP_SWITCH_BAR'
      ];
   },
   /**
    * 初始化os相关的环境数据
    * 比如当前用户的sessionid，当前用户桌面配置数据，桌面布局，桌面app图片
    * 从服务器上获取这些数据然后存放在环境变量里面
    */
   initOsEnvInfo : function()
   {
      C = WebOs.Const;
      /**
       * 注册相关系统配置对象
       */
      this.sysEnv.set(C.WEBOS_V_DESKTOP, {});
      this.sysEnv.set(C.WEBOS_SYS_MENU, {});
   },
   /**
    * 设置Os组件,主要绑定一些事件
    *
    * @param {Cntysoft.SysUi.OsWidget.Ui.Desktop} widget
    * @return
    */
   setupOsWidget : function(widget)
   {
      widget.addListener({
         afterrender : this.sysReadyHandler,
         scope : this
      });
   },
   /**
    * 资源清除
    */
   destroy : function()
   {
      Ext.destroyMembers(this, 'desktop');
      this.osWidgetMap.clear();
      delete this.osWidgetMap;
      this.callParent();
   }
});