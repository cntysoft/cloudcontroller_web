/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Main", {
   extend: "WebOs.Kernel.ProcessModel.App",
   requires: [
      "App.Sys.Setting.Lang.zh_CN",
      //"App.Sys.User.Const",
      "App.Sys.Setting.Widget.Entry",
      "App.Sys.Setting.Widget.VersionInfo",
      "App.Sys.Setting.Widget.UpgradeMetaInfo",
      "App.Sys.Setting.Widget.UpgradeCloudController",
      "App.Sys.Setting.Widget.UpgradeUpgradeMgrMaster"
   ],
   /**
    * @inheritdoc
    */
   id: "Sys.Setting",
   /**
    * @inheritdoc
    */
   widgetMap: {
      Entry: "App.Sys.Setting.Widget.Entry",
      VersionInfo : "App.Sys.Setting.Widget.VersionInfo",
      UpgradeMetaInfo : "App.Sys.Setting.Widget.UpgradeMetaInfo",
      UpgradeCloudController : "App.Sys.Setting.Widget.UpgradeCloudController",
      UpgradeUpgradeMgrMaster : "App.Sys.Setting.Widget.UpgradeUpgradeMgrMaster"
   },
   /**
    * @var {Ext.util.HashMap} serviceInvokerPool
    */
   serviceInvokerPool : null,
   
   constructor : function(config)
   {
      this.serviceInvokerPool = new Ext.util.HashMap();
      this.callParent([config]);
   },
   
   getCloudControllerVersion : function(callback, scope)
   {
      this.callApp('VersionInfo/getCloudControllerVersion', null, callback, scope);
   },
   
   getUpgrademgrVersion : function(callback, scope)
   {
      var serviceInvoker = this.getServiceInvoker("upgrademgr");
      serviceInvoker.callService("ServerStatus/Info", "getVersionInfo", {}, callback, scope);
   },
   
   setServiceServerAddressMeta : function(data, callback, scope)
   {
      var serviceInvoker = this.getServiceInvoker("upgrademgr");
      serviceInvoker.callService("ServerStatus/Info", "setServiceServerAddressMeta", {
         servers : data
      }, callback, scope);
   },
   
   getServiceServerAddressMeta : function(callback, scope)
   {
      var serviceInvoker = this.getServiceInvoker("upgrademgr");
      serviceInvoker.callService("ServerStatus/Info", "getServiceServerAddressMeta", null, callback, scope);
   },
   
   upgradeCloudController : function(fromVersion, toVersion, callback, scope)
   {
      var serviceInvoker = this.getServiceInvoker("upgrademgr");
      serviceInvoker.callService("Upgrader/UpgradeCloudController", "upgrade", {
         fromVersion : fromVersion,
         toVersion : toVersion
      }, callback, scope);
   },
   
   UpgradeUpgradeMgrMaster : function(targetVersion, callback, scope)
   {
      var serviceInvoker = this.getServiceInvoker("upgrademgr");
      serviceInvoker.callService("Upgrader/UpgradeUpgradeMgrMaster", "upgrade", {
         version : targetVersion
      }, callback, scope);
   },
   
   getServiceInvoker : function(entry)
   {
      if(!this.serviceInvokerPool.containsKey(entry)){
         var websocketUrl = CloudController.Kernel.Funcs.getWebSocketEntry(entry);
         this.serviceInvokerPool.add(entry, new Cntysoft.Framework.Rpc.ServiceInvoker({
            serviceHost: websocketUrl,
            listeners : {
               connecterror : function(invoker, event){
                  Cntysoft.showErrorWindow(Ext.String.format(Cntysoft.GET_LANG_TEXT("MSG.CONNECT_WEBSOCKET_FAIL"), websocketUrl));
                  Cntysoft.raiseError(Ext.getClassName(this), "run", "connect to websocket server " + websocketUrl + " error");
                  
               },
               scope : this
            }
         }));
      }
      return this.serviceInvokerPool.get(entry);
   },
   
   
   destroy : function()
   {
      this.serviceInvokerPool.each(function(key, value){
         Ext.destroy(value);
      }, this);
      this.serviceInvokerPool.clear();
      this.callParent();
   }
});