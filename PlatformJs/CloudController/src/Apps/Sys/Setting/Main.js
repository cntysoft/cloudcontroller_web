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
      "App.Sys.Setting.Widget.VersionInfo"
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
      VersionInfo : "App.Sys.Setting.Widget.VersionInfo"
   },
   /**
    * @var {[]Cntysoft.Framework.Rpc.ServiceInvoker} serviceInvoker
    */
   serviceInvokerPool : {},
   
   getCloudControllerVersion : function(callback, scope)
   {
      this.callApp('VersionInfo/getCloudControllerVersion', null, callback, scope);
   },
   
   getUpgrademgrVersion : function(callback, scope)
   {
      var serviceInvoker = this.getServiceInvoker("upgrademgr");
      serviceInvoker.callService("ServerStatus/Info", "getVersionInfo", {}, callback, scope);
   },
   
   getServiceInvoker : function(entry)
   {
      if(!this.serviceInvokerPool[entry]){
         var websocketUrl = CloudController.Kernel.Funcs.getWebSocketEntry(entry);
         this.serviceInvokerPool[entry] = new Cntysoft.Framework.Rpc.ServiceInvoker({
            serviceHost: websocketUrl,
            listeners : {
               connecterror : function(invoker, event){
                  Cntysoft.showErrorWindow(Ext.String.format(this.GET_LANG_TEXT("ENTRY.ERROR.CONNECT_WEBSOCKET_FAIL"), websocketUrl));
                  Cntysoft.raiseError(Ext.getClassName(this), "run", "connect to websocket server " + websocketUrl + " error");
                  
               },
               scope : this
            }
         });
      }
      return this.serviceInvokerPool[entry];
   },
   destroy : function()
   {
      for(var entry in serviceInvokerPool){
         Ext.destroy(this.serviceInvokerPool[entry]);
      }
      this.serviceInvokerPool = {};
      this.callParent();
   }
});